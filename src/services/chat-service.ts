import { ChatGPTAPI } from "chatgpt";


export default class ChatService {
    private openai: ChatGPTAPI;
    constructor() {
        this.openai = new ChatGPTAPI({
            apiOrg: "org-OCpq7Sg9F80MLFBRAsvSnYKu",
            apiKey: "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",
        });
    }

    public async getSongResume(max_length: number, lyrics: string): Promise<any> {
        const prompt = `Sobre o que essa musica fala? Escreva de uma forma apaixonante em ${max_length} caracteres: ${lyrics}`
        return await this.openai.sendMessage(prompt);
    }

}