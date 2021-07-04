import { sendToTelegram } from './social/tg';
import { getModeratedContent } from './moderation-bot/moderation-bot';

(async () => {
    try {
        const { text, imageBuffer } = await getModeratedContent();
        await sendToTelegram(imageBuffer, text);
    } catch (error) {
        console.log(error);
    }
})();
