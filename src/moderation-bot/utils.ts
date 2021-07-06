import { Telegraf } from 'telegraf';
import config from '../config';
import { ImageCounter } from '../image-counter/image-counter';

export enum ModerationKeyboard {
    Ok = 'Одобряю',
    NextText = 'Другой текст',
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

export const sendContentToModeration = async (
    bot: Telegraf,
    imageBuffer: Buffer,
    text: string,
    { bodyImageCounter, maskImageCounter }: { bodyImageCounter: ImageCounter; maskImageCounter: ImageCounter }
) => {
    await bot.telegram.sendPhoto(
        config.MODERATION_TG_CHANNEL_ID!,
        { source: imageBuffer },
        {
            caption: `${text}\n\n Тело: ${getCounterMessage(bodyImageCounter)}\nМаска: ${getCounterMessage(
                maskImageCounter,
                true
            )}`,
            parse_mode: 'HTML',
            reply_markup: { keyboard: getModerationKeyboard() },
        }
    );
};

const getCounterMessage = (counter: ImageCounter, add = false) =>
    `${counter.getCounter() + (add ? 1 : 0)} из ${counter.getImagesLength()}`;

export const sendFinishMessageToModeration = async (bot: Telegraf, text = 'Закончили') => {
    await bot.telegram.sendMessage(config.MODERATION_TG_CHANNEL_ID!, text, {
        parse_mode: 'HTML',
        reply_markup: { keyboard: [] },
    });
};

const getModerationKeyboard = () => [
    ...getKeyboardInRow(Object.values(ModerationKeyboard)),
    getKeyboard(Object.values(MaskShiftKeyboard)),
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
