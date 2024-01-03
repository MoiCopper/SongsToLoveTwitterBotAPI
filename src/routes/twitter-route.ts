import { FastifyInstance } from "fastify";
import VideoService from '../services/video-service';
import SongService from '../services/song-service';

export async function twitterRoutes(app: FastifyInstance) {
    app.get('/', async (request, reply) => {
        try {
            const songService = new SongService();
            const { title, songPath } = await songService.downloadSong('9usYUdB4w2A&ab_channel=anaisadreamer-');
            const cutSongPath = await songService.cutSong(songPath, title,'00:03:04', '00:00:50');
            
            
            const videoService = new VideoService();
            await videoService.generateVideo(cutSongPath, title, 50);
            
            await songService.deleteSong(songPath);
            await songService.deleteSong(cutSongPath);
            return reply.send();
        } catch (err) {
            return reply.send(err);
        }
    })
}