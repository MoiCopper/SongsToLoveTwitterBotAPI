import ffmpeg from 'fluent-ffmpeg'
import path from 'node:path'

export default class VideoService {
    public async generateVideo(songPath:string, videoTitle:string, duration:number) {
        return new Promise((resolve, reject) => {
            const imageDir = path.join(__dirname, '../../', 'snpnk_mashiro_hair_flow.gif');
            const videoPath = path.join(__dirname, '../../temp', `${videoTitle}.mp4`);
            ffmpeg().input(imageDir)
            .inputOptions('-ignore_loop 0')
            .inputOptions('-stream_loop -1')
            .input(songPath)
                .audioCodec('copy')
                .outputOptions('-map', '0:v:0', '-map', '1:a:0')
                .duration(duration)
                .save(videoPath)
                .on('end', resolve)
                .on('error', (err) => reject(err.message))
                .run();
        })

    }
}