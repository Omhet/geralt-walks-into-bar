import { generateImage } from './image-generator';
import { generateText } from './text-generator';

const query = 'Геральт заходит в бар.';

(async () => {
    // const generatedText = generateText(query);
    const image = await generateImage();
    // console.log(image);
})();
