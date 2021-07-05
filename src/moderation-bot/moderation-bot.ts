import { Telegraf } from 'telegraf';
import config from '../config';
import { bodyUrls, maskUrls } from '../data';
import { ImageCounter } from '../image-counter/image-counter';
import { generateImage } from '../image-generator';
import { generateText } from '../text-generator';
import { Content } from '../types';
import { ModerationKeyboard, sendContentToModeration, sendFinishMessageToModeration } from './utils';

const bodyImageCounter = new ImageCounter(bodyUrls, 'body');
const maskImageCounter = new ImageCounter(maskUrls, 'mask');
let flipMask = false;

export const getModeratedContent = async (): Promise<Content> => {
    return new Promise(async (resolve, reject) => {
        const bot = new Telegraf(config.MODERATION_TG_BOT_TOKEN!);
        console.log('Moderation bot started');
        await bot.launch();
        try {
            let text = await getNextText();
            let imageBuffer = await getNextImage({ nextBody: true, isFirstTime: true, flipMask });

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
                imageBuffer = await getNextImage({ nextBody: true, flipMask });
                await sendToModeration();
            });
            bot.hears(ModerationKeyboard.NextMask, async () => {
                imageBuffer = await getNextImage({ nextMask: true, flipMask });
                await sendToModeration();
            });
            bot.hears(ModerationKeyboard.FlipMask, async () => {
                flipMask = !flipMask;
                imageBuffer = await getNextImage({ flipMask });
                await sendToModeration();
            });
            bot.hears(ModerationKeyboard.NextText, async () => {
                text = await getNextText();
                await sendToModeration();
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

const getNextImage = async ({ nextBody = false, nextMask = false, isFirstTime = false, flipMask = false } = {}) => {
    console.log('Generating image');
    const bodyUrl = nextBody ? bodyImageCounter.getNextImageUrl() : bodyImageCounter.getCurrentImageUrl();
    const maskUrl = nextMask ? maskImageCounter.getNextImageUrl() : maskImageCounter.getCurrentImageUrl();
    const image = await generateImage(bodyUrl, maskUrl, { shouldLoadModels: isFirstTime, flipMask });
    console.log('Image generated');
    return image;
};

const getNextText = async () => {
    console.log('Generating text');
    const text = await generateText();
    console.log('Next text generated');
    return text;
};
