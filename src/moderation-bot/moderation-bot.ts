import { Context, Telegraf } from 'telegraf';
import config from '../config';
import { bodyUrls, maskUrls } from '../data';
import { ImageCounter } from '../image-counter/image-counter';
import { generateImage } from '../image-generator';
import { generateText } from '../text-generator';
import { Content } from '../types';
import {
    ModerationKeyboard,
    sendContentToModeration,
    sendFinishMessageToModeration,
    MaskShiftKeyboard,
    maskShiftKeyToShiftAmount,
} from './utils';

const bodyImageCounter = new ImageCounter(bodyUrls, 'body');
const maskImageCounter = new ImageCounter(maskUrls, 'mask');

const phraseSet = 'Фраза: ';
const startPhrase = 'Геральт заходит в бар.';
let continuePhrase = '';

let flipMask = false;
let maskShift = { x: 0, y: 0 };

export const getModeratedContent = async (): Promise<Content> => {
    return new Promise(async (resolve) => {
        const bot = new Telegraf(config.MODERATION_TG_BOT_TOKEN!);
        await bot.launch();
        console.log('Moderation bot started');

        try {
            let text = await getNextText();
            let imageBuffer = await getNextImage({ nextBody: true, isFirstTime: true });

            const sendToModeration = () =>
                sendContentToModeration(bot, imageBuffer, text, {
                    bodyImageCounter,
                    maskImageCounter,
                });

            await sendToModeration();

            bot.hears(ModerationKeyboard.Ok, async () => {
                console.log('Moderation approved');
                await sendFinishMessageToModeration(bot);
                await bot.stop();
                resolve({ text, imageBuffer });
            });
            bot.hears(ModerationKeyboard.NextBody, async () => {
                maskShift = getShiftReset();
                imageBuffer = await getNextImage({ nextBody: true });
                await sendToModeration();
            });
            bot.hears(ModerationKeyboard.NextMask, async () => {
                maskShift = getShiftReset();
                imageBuffer = await getNextImage({ nextMask: true });
                await sendToModeration();
            });
            bot.hears(ModerationKeyboard.FlipMask, async () => {
                flipMask = !flipMask;
                imageBuffer = await getNextImage({ maskShift });
                await sendToModeration();
            });
            Object.values(MaskShiftKeyboard).forEach((key) => {
                bot.hears(key, async () => {
                    maskShift = maskShiftKeyToShiftAmount(key, maskShift);
                    imageBuffer = await getNextImage({ maskShift });
                    await sendToModeration();
                });
            });
            bot.hears(ModerationKeyboard.NextText, async () => {
                text = await getNextText();
                await sendToModeration();
            });
            bot.on('text', async (ctx) => {
                const messageText = ctx.message.text;
                if (messageText.startsWith(phraseSet)) {
                    continuePhrase = messageText.replace(phraseSet, '');
                    text = await getNextText();
                    await sendToModeration();
                    ctx.state.action = '';
                }
            });
            bot.catch(async (error: any) => {
                console.log(error);
                await sendFinishMessageToModeration(bot, `Ошибка:\n${error.message}`);
            });
        } catch (error) {
            console.log(error);
            await sendFinishMessageToModeration(bot, `Ошибка:\n${error.message}`);
        }
    });
};

const getNextImage = async ({
    nextBody = false,
    nextMask = false,
    isFirstTime = false,
    maskShift = { x: 0, y: 0 },
} = {}) => {
    console.log('Generating image');
    const bodyUrl = nextBody ? bodyImageCounter.getNextImageUrl() : bodyImageCounter.getCurrentImageUrl();
    const maskUrl = nextMask ? maskImageCounter.getNextImageUrl() : maskImageCounter.getCurrentImageUrl();
    const image = await generateImage(bodyUrl, maskUrl, { shouldLoadModels: isFirstTime, flipMask, maskShift });
    console.log('Image generated');
    return image;
};

const getNextText = async () => {
    console.log('Generating text');
    const query = `${startPhrase}${continuePhrase}`;
    const text = await generateText(query);
    console.log('Next text generated');
    return text;
};

const getShiftReset = () => ({ x: 0, y: 0 });
