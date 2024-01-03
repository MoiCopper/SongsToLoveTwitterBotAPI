import puppeteer from 'puppeteer';
import ytdl from 'ytdl-core';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import ffmpeg from 'fluent-ffmpeg'

export interface SongLyrics {
    url: string;
    lyricList: Array<string>;
    lyricsElementInnerText: string;
}

export interface Song {
    title: string;
    songPath: string;
}

export default class SongService {

    public downloadSong(videoId: string): Promise<Song> {
        return new Promise(async (resolve, reject) => {
            const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const info = await ytdl.getInfo(youtubeUrl);
            const { title } = info.videoDetails;
            const songPath = path.join(__dirname, '../../temp', `${title}.mp3`);
            ytdl(youtubeUrl, { filter: 'audioonly' }).pipe(fs.createWriteStream(songPath)
                .on('finish', () => resolve({ title, songPath }))
                .on('error', (err) => reject(err)));
        })
    }

    public deleteSong(path: string): Promise<void> {
        return fsPromises.unlink(path)
    }

    // time format should be '00:00:10';
    public async cutSong(songPath:string, songTitle:string, startTime:string, cutDuration:string):Promise<string> {
        return new Promise((resolve, reject) => {
            const output = path.join(__dirname, '../../temp', `${songTitle}-cut.mp3`);
            ffmpeg(songPath)
            .setStartTime(startTime)
            .setDuration(cutDuration)
            .output(output)
            .on('end', () => {
              resolve(output);
            })
            .on('error', (err) => {
                reject(err);
            })
            .run(); 
        })
    }


    public async getSongLyric(artist: string, track: string): Promise<SongLyrics> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const url = `https://genius.com/${this.getUrlParameters(artist, track)}-lyrics`;
        await page.goto(url, { timeout: 0 })
        const lyricsElementInnerText = await page.evaluate(() => {
            const lyricsElement = document.querySelector('.Lyrics__Container-sc-1ynbvzw-5') as HTMLElement;
            return lyricsElement?.innerText || null;
        });

        if (!lyricsElementInnerText) {
            throw new Error(`lyric not found from ${page.url()}`)
        }

        return {
            url,
            lyricList: lyricsElementInnerText.split(/\r?\n/).filter((item) => item.length > 0),
            lyricsElementInnerText
        }
    }

    private getUrlParameters(artist: string, track: string): string {
        const parameters = `${artist} ${track}`.replace(/&/g, ' ').replace(/[^\w\s]/gi, '').replace(/[\s&]+/g, '-')
        return parameters;
    }
}