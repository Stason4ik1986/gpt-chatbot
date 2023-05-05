import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

export const __filename = fileURLToPath(import.meta.url);
// get the directory of the current module file
export const __dirname = path.dirname(__filename);
// get the project root directory
export const APP_ROOT_PATH = path.join(__dirname, '../');

dotenv.config({ path: `${APP_ROOT_PATH}.env.${process.env.NODE_ENV}` }); // change according to your need

export const CONFIG = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
};

