import { sendToTelegram } from './social/tg';
import { getModeratedContent } from './moderation-bot/moderation-bot';
import { sendToVK } from './social/vk';

(async () => {
    try {
        const { text, imageBuffer } = await getModeratedContent();
        await sendToTelegram(imageBuffer, text);
        // await sendToVK();
    } catch (error) {
        console.log(error);
    }
})();
