import * as canvasPkg from 'canvas';
import * as faceapi from 'face-api.js';
import { bodyUrls, maskUrls } from '../data';
import { ImageCounter } from '../image-counter/image-counter';
import { loadModels, maskify } from './utils';

const { Canvas, Image, ImageData } = canvasPkg;
// @ts-ignore
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

export async function generateImage() {
    console.log('Generating image...');

    const bodyImageCounter = new ImageCounter(bodyUrls, 'body');
    const maskImageCounter = new ImageCounter(maskUrls, 'mask');
    const bodyUrl = bodyImageCounter.getNextImageUrl();
    const geraltUrl = maskImageCounter.getNextImageUrl();

    await loadModels();
    return maskify(bodyUrl, geraltUrl);
}
