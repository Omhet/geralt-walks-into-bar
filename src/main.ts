import { generateImage } from './image-generator';
import { sendToTelegram } from './social/tg';
import { generateText } from './text-generator';

(async () => {
    try {
        const text = await generateText();
        const imageBuffer = await generateImage();

        await sendToTelegram(imageBuffer, text);
    } catch (error) {
        console.log(error);
    }
})();
