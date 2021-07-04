import { Telegraf } from 'telegraf';
import config from '../config';

export const sendToTelegram = async (imageBuffer: Buffer, text: string) => {
    console.log('Sending to Telegram');
    const bot = new Telegraf(config.SOCIAL_TG_BOT_TOKEN!);
    await bot.launch();
    await bot.telegram.sendPhoto(config.SOCIAL_TG_CHANNEL_ID!, { source: imageBuffer }, { caption: text });
    await bot.stop();
    console.log('Sending to Telegram: Done');
};
