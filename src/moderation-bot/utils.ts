import { Telegraf } from 'telegraf';
import config from '../config';
import { ImageCounter } from '../image-counter/image-counter';

export enum ModerationKeyboard {
    Ok = 'Одобряю',
    NextText = 'Другой текст',
    LoopText = 'Зациклить текст',
    NextBody = 'Другое тело',
    NextMask = 'Другая маска',
    FlipMask = 'Отразить маску',
}

export enum MaskShiftKeyboard {
    Up = '⬆️',
    Down = '⬇️',
    Right = '➡️',
    Left = '⬅️',
}

export enum MaskScaleKeyboard {
    More = '+',
    Less = '-',
}

export const sendContentToModeration = async (
    bot: Telegraf,
    imageBuffer: Buffer,
    text: string,
    { bodyImageCounter }: { bodyImageCounter: ImageCounter }
) => {
    await bot.telegram.sendPhoto(
        config.MODERATION_TG_CHANNEL_ID!,
        { source: imageBuffer },
        {
            caption: text,
            parse_mode: 'HTML',
            reply_markup: { keyboard: getModerationKeyboard() },
        }
    );

    await sendFinishMessageToModeration(bot, `\n\n Тело: ${getCounterMessage(bodyImageCounter)}`);
};

const getCounterMessage = (counter: ImageCounter) => `${counter.getCounter()} из ${counter.getImagesLength()}`;

export const sendFinishMessageToModeration = async (bot: Telegraf, text = 'Закончили') => {
    await bot.telegram.sendMessage(config.MODERATION_TG_CHANNEL_ID!, text, {
        parse_mode: 'HTML',
        reply_markup: { keyboard: [] },
    });
};

const getModerationKeyboard = () => [
    ...getKeyboardInRow(Object.values(ModerationKeyboard)),
    getKeyboard(Object.values(MaskShiftKeyboard)),
    getKeyboard(Object.values(MaskScaleKeyboard)),
];

const getKeyboardInRow = (arr: string[]) => arr.map((key) => getKeyInRow(key));
const getKeyboard = (arr: string[]) => arr.map((key) => getKey(key));

const getKeyInRow = (text: string) => [getKey(text)];
const getKey = (text: string) => ({ text, callback_data: text });

export const maskShiftKeyToShiftAmount = (key: MaskShiftKeyboard, maskShift: { x: number; y: number }) => {
    const shiftAmount = 5;
    switch (key) {
        case MaskShiftKeyboard.Up:
            maskShift.y -= shiftAmount;
            break;
        case MaskShiftKeyboard.Down:
            maskShift.y += shiftAmount;
            break;
        case MaskShiftKeyboard.Right:
            maskShift.x += shiftAmount;
            break;
        case MaskShiftKeyboard.Left:
            maskShift.x -= shiftAmount;
            break;
    }

    return maskShift;
};

export const maskScaleKeyToScaleAmount = (key: MaskScaleKeyboard, maskScale: number) => {
    const shiftAmount = 0.05;
    switch (key) {
        case MaskScaleKeyboard.More:
            maskScale += shiftAmount;
            break;
        case MaskScaleKeyboard.Less:
            maskScale -= shiftAmount;
            break;
    }

    return maskScale;
};

export const wait = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));
