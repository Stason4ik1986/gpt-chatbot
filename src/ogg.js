import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import installer from '@ffmpeg-installer/ffmpeg';
import { dirname, resolve } from 'path';
import { createWriteStream } from 'fs';

import { removeFile } from './utils.js';
import { __dirname } from '../config/config.js';

class OggConverter {
  constructor() {
    ffmpeg.setFfmpegPath(installer.path);
  }

  convertOggToMp3(input, output) {
    try {
      const outputPath = resolve(dirname(input), `${output}.mp3`);
      return new Promise((resolve, reject) => {
        ffmpeg(input)
          .inputOption('-t 30')
          .output(outputPath)
          .on('end', () => {
            resolve(outputPath)
            removeFile(input);
          })
          .on('error', () => reject(err.message))
          .run();
      });
    } catch (error) {
      console.log('Error while converting .ogg to .mp3', error.message);
    }
  }

  async create(url, filename) {
    try {
      const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`);
      const response = await axios({
        method: 'get',
        url,
        responseType: 'stream',
      });
      return new Promise((resolve) => {
        const stream = createWriteStream(oggPath);
        response.data.pipe(stream);
        stream.on('finish', () => resolve(oggPath));
      });
    } catch (error) {
      console.log('Error while creating ogg', error.message);
    }
  }
}

export const ogg = new OggConverter();
