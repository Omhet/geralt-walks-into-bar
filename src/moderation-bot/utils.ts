import { Telegraf } from 'telegraf';
import config from '../config';

export enum ModerationKeyboard {
    Ok = 'Одобряю',
    NextBody = 'Другое тело',
    NextMask = 'Другая маска',
    FlipMask = 'Отразить маску',
    NextText = 'Другой текст',
}

export const sendContentToModeration = async (bot: Telegraf, imageBuffer: Buffer, text: string) => {
    await bot.telegram.sendPhoto(
        config.MODERATION_TG_CHANNEL_ID!,
        { source: imageBuffer },
        { caption: text, parse_mode: 'HTML', reply_markup: { keyboard: getKeyboard() } }
    );
};

export const sendFinishMessageToModeration = async (bot: Telegraf, text = 'Закончили') => {
    await bot.telegram.sendMessage(config.MODERATION_TG_CHANNEL_ID!, text, {
        parse_mode: 'HTML',
        reply_markup: { keyboard: [] },
    });
};

const getKeyboard = () => Object.values(ModerationKeyboard).map((key) => getKey(key));

const getKey = (text: string) => [{ text, callback_data: text }];
