import { FastifyInstance } from "fastify";
import { z } from 'zod';
import SongService from "../services/song-service";

export async function songRoutes(app: FastifyInstance) {
    app.get('/lyrics', async (request, reply) => {
        const getSongParamsSquema = z.object({
            artist: z.string(),
            track: z.string(),
        })

        const { artist, track } = getSongParamsSquema.parse(request.query);
        try {
            const songService = new SongService();
            const songLyrics = await songService.getSongLyric(artist, track);
            reply.send(songLyrics);
        }catch(err) {
            reply.send(err);
        }
    })
}