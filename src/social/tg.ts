import { Telegraf } from 'telegraf';
import config from '../config';

const channelId = config.isDev ? config.SOCIAL_TG_TEST_CHANNEL_ID! : config.SOCIAL_TG_CHANNEL_ID!;

export const sendToTelegram = async (imageUrl: string, text: string) => {
    console.log('Sending to Telegram');
    const bot = new Telegraf(config.SOCIAL_TG_BOT_TOKEN!);
    await bot.launch();
    await bot.telegram.sendPhoto(channelId, imageUrl, { caption: text });
    await bot.stop();
    console.log('Sending to Telegram: Done');
};
