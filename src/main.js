import { Telegraf, session } from 'telegraf';
import { code } from 'telegraf/format';
import { message } from 'telegraf/filters';

import { CONFIG } from '../config/config.js';

import { ogg } from './ogg.js';
import { openai } from './openai.js';

const bot = new Telegraf(CONFIG.TELEGRAM_BOT_TOKEN);
const INITIAL_SESSION = {
  messages: [],
};

bot.use(session());

bot.command('new', async (ctx) => {
  ctx.session = INITIAL_SESSION;

  await ctx.reply('🫠 Waiting for your voice or text message...');
});

bot.command('start', async (ctx) => {
  ctx.session = INITIAL_SESSION;

  await ctx.reply('🫠 Waiting for your voice or text message...');
});

bot.on(message('voice'), async (ctx) => {
  ctx.session = ctx.session ? ctx.session : INITIAL_SESSION;

  try {
    await ctx.reply(code('😤 Request processing...'));
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const userId = await ctx.message.from.id;
    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.convertOggToMp3(oggPath, userId);
    const text = await openai.transcription(mp3Path);
    ctx.session.messages.push({
      role: openai.roles.USER,
      content: text,
    });
    await ctx.reply(code(`👨🏽‍💻 Searching for your request 👨🏽‍💻... ${text}`));

    const response = await openai.chat(ctx.session.messages);
    ctx.session.messages.push({
      role: openai.roles.ASSISTANT,
      content: response.content,
    });
    await ctx.reply(response.content);
  } catch (error) {
    console.log('Error while voice message', error.message);
    await ctx.reply(error.message);
  }
});

bot.on(message('text'), async (ctx) => {
  ctx.session = ctx.session ? ctx.session : INITIAL_SESSION;

  try {
    await ctx.reply(code('😤 Request processing...'));
    ctx.session.messages.push({
      role: openai.roles.USER,
      content: ctx.message.text,
    });

    const response = await openai.chat(ctx.session.messages);

    ctx.session.messages.push({
      role: openai.roles.ASSISTANT,
      content: response.content,
    });
    await ctx.reply(response.content);
  } catch (error) {
    console.log('Error while text message', error.message);
    await ctx.reply(error.message);
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));