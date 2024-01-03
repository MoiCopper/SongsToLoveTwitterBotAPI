import fastify from 'fastify'
import { twitterRoutes } from './routes/twitter-route';
import { songRoutes } from './routes/song-route';
import { chatBotRoutes } from './routes/chatbot-routes';

export const app = fastify()
app.register(twitterRoutes, {
    prefix:'twitter'
});
app.register(songRoutes, {
    prefix:'song'
});
app.register(chatBotRoutes, {
    prefix:'chatbot'
});
