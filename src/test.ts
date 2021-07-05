import fs from 'fs';
import { bodyUrls, maskUrls } from './data';
import { ImageCounter } from './image-counter/image-counter';
import { generateImage } from './image-generator';
import path from 'path';

(async () => {
    const bodyImageCounter = new ImageCounter(bodyUrls, 'body');
    const maskImageCounter = new ImageCounter(maskUrls, 'mask');
    const bodyUrl = bodyImageCounter.getCurrentImageUrl();
    const maskUrl = maskImageCounter.getCurrentImageUrl();
    const image = await generateImage(bodyUrl, maskUrl, { shouldLoadModels: true, flipMask: false });
    fs.writeFileSync(path.join(__dirname, './test.jpg'), image);
})();