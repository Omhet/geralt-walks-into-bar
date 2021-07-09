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
    const image = await generateImage(bodyUrl, maskUrl, {
        shouldLoadModels: true,
        flipMask: true,
        maskScale: 0.95,
        maskShift: { y: -5, x: 0 },
    });
    fs.writeFileSync(path.join(__dirname, './test-output/test.jpg'), image);
})();
