import jwt from 'jsonwebtoken';
import axios from 'axios';
import { readFileSync } from 'fs';

import { APP_ROOT_PATH } from '../config/config.js';

// https://cloud.google.com/text-to-speech?_gl=1*13cajlu*_ga*NTkzNjU2MDU5LjE2ODQ5MTk1OTg.*_ga_WH2QY8WWF5*MTY4NDkyNjE2NC4zLjEuMTY4NDkyNjQ2OS4wLjAuMA..&_ga=2.249961922.-593656059.1684919598&_gac=1.82570724.1684919715.CjwKCAjw67ajBhAVEiwA2g_jEMEhcMjdPJw0VHXNUYEwhBDOxhuw-z0rM32wPLt-91lD5pCynlShlBoCh68QAvD_BwE
class TextConverter {
  async getToken() {
    // google-youtube.json is not real in my case. Just for example
    const key = JSON.parse(readFileSync(`${APP_ROOT_PATH}google-youtube.json`, 'utf-8'));

    const token = jwt.sign(
      {
        iss: key.client_email,
        scope: 'https://www.googleapis.com/auth/cloud-platform',
        aud: 'https://www.googleapis.com/oauth2/v4/token',
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        iat: Math.floor(Date.now() / 1000),
      },
      key.private_key,
      { algorithm: 'RS256' }
    );

    const response = await axios.post('https://www.googleapis.com/oauth2/v4/token', {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token,
    });

    return response.data.access_token;
  }

  async textToSpeech(text) {
    try {
      const url = 'https://texttospeech.googleapis.com/v1/text:synthesize';
      const data = {
        input: text,
        voice: {
          languageCode: 'uk-UA',
          name: 'uk-UA-Wavenet-A',
        },
        audioConfig: {
          audioEncoding: 'MP3',
          pitch: 0,
          speakingRate: 1,
        },
      };

      // Use it with thr real Google API and access tokens
      // const accessToken = await this.getToken();

      // const response = await axios({
      //   url,
      //   method: 'POST',
      //   data,
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //     'Content-Type': 'application/json',
      //   },
      // });

      const base64String = readFileSync(`${APP_ROOT_PATH}audio-plug.txt`, 'utf-8') ?? response?.data?.auditContent;
      
      return Buffer.from(base64String, 'base64');
    } catch (error) {
      console.error('Error while text to speech', error.message);
    }
  }
}

export const textConverter = new TextConverter();
