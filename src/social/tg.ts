import { Telegraf } from 'telegraf';
import config from '../config';

export const sendToTelegram = async (imageBuffer: Buffer, text: string) => {
    const bot = new Telegraf(config.BOT_TOKEN!);
    await bot.telegram.sendPhoto(config.TG_CHANNEL_ID!, { source: imageBuffer }, { caption: text });
};
