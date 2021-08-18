import { sendToTelegram } from './social/tg';
import { getModeratedContent } from './moderation-bot/moderation-bot';
import { sendToVK } from './social/vk';
import { uploadImage } from './upload-image/upload-image';

(async () => {
    try {
        const { text, imageBuffer } = await getModeratedContent();
        // const imageUrl = await uploadImage(imageBuffer);

        await sendToTelegram(imageBuffer, text);
        // await sendToVK(imageUrl, text);
    } catch (error) {
        console.log(error);
    }
})();
