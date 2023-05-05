import { createReadStream } from 'fs';
import { Configuration, OpenAIApi } from 'openai';
import {CONFIG} from '../config/config.js';

class OpenAI {
  roles = {
    USER: 'user',
    SYSTEM: 'sysytem',
    ASSISTANT: 'assistant',
  };
  constructor() {
    console.log(CONFIG.OPEN_AI_API_KEY);
    const configuration = new Configuration({
      apiKey: CONFIG.OPEN_AI_API_KEY,
    });

    this.openai = new OpenAIApi(configuration);
  }

  async chat(messages) {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
      });
      console.log(messages);
      return response.data.choices[0].message;
    } catch (error) {
      console.log('Error while gpt chat', error.message);
    }
  }

  async transcription(filePath) {
    try {
      const response = await this.openai.createTranscription(createReadStream(filePath), 'whisper-1');

      return response.data.text;
    } catch (error) {
      console.log('Error while transcription', error.message);
    }
  }
}

export const openai = new OpenAI();
