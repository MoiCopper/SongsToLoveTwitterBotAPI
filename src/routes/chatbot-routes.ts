import { FastifyInstance } from "fastify";
import { z } from 'zod'
import ChatService from '../services/chat-service';

export async function chatBotRoutes(app: FastifyInstance) {
    app.post('/promptLyrics', async (request, reply) => {
        const getSongParamsSquema = z.object({
            lyrics: z.string(),
            maxlength: z.number(),
        })

        const { lyrics, maxlength } = getSongParamsSquema.parse(request.body);
        try {
            const chatService = new ChatService();
            const { text } = await chatService.getSongResume(maxlength, lyrics);
    
            reply.send({text});
        }catch(err) {
            reply.send(err);
        }
    })
}