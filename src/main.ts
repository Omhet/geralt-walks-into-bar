import { generateImage } from './image-generator';
import { sendToTelegram } from './social/tg';
import { generateText } from './text-generator';

const query = 'Геральт заходит в бар.';

(async () => {
    try {
        const text = await generateText(query);
        const imageBuffer = await generateImage();

        await sendToTelegram(imageBuffer, text);
    } catch (error) {
        console.log(error);
    }
})();
