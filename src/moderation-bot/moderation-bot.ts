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

export const getModeratedContent = async (): Promise<Content> => {
    return new Promise(async (resolve, reject) => {
        try {
            const bot = new Telegraf(config.MODERATION_TG_BOT_TOKEN!);
            console.log('Moderation bot started');
            await bot.launch();

            console.log('Generating text');
            let text = await generateText();
            console.log('Text generated');

            console.log('Generating image');
            let imageBuffer = await getNextImage({ isFirstTime: true });
            console.log('Image generated');

            await sendContentToModeration(bot, imageBuffer, text);

            bot.hears(ModerationKeyboard.Ok, async () => {
                console.log('Moderation approved');
                await sendFinishMessageToModeration(bot);
                await bot.stop();
                resolve({ text, imageBuffer });
            });
            bot.hears(ModerationKeyboard.NextBody, async () => {
                console.log('Generating image');
                imageBuffer = await getNextImage({ nextBody: true, nextMask: false });
                console.log('Next body image generated');
                await sendContentToModeration(bot, imageBuffer, text);
            });
            bot.hears(ModerationKeyboard.NextMask, async () => {
                console.log('Generating image');
                imageBuffer = await getNextImage({ nextBody: false, nextMask: true });
                console.log('Next mask image generated');
                await sendContentToModeration(bot, imageBuffer, text);
            });
            bot.hears(ModerationKeyboard.NextText, async () => {
                console.log('Generating text');
                text = await generateText();
                console.log('Next text generated');
                await sendContentToModeration(bot, imageBuffer, text);
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getNextImage = async ({ nextBody = true, nextMask = true, isFirstTime = false } = {}) => {
    const bodyUrl = nextBody ? bodyImageCounter.getNextImageUrl() : bodyImageCounter.getCurrentImageUrl();
    const maskUrl = nextMask ? maskImageCounter.getNextImageUrl() : maskImageCounter.getCurrentImageUrl();
    return await generateImage(bodyUrl, maskUrl, isFirstTime);
};
