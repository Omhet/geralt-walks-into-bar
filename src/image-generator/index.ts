import * as canvasPkg from 'canvas';
import * as faceapi from 'face-api.js';
import path from 'path';
import { getRandomArrayElement, loadModels, maskify } from './utils';

const { Canvas, Image, ImageData } = canvasPkg;
// @ts-ignore
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const bodyUrls = ['1', '2', '3', '4', '5', '6', '7'];
const geraltUrls = ['1'];

export async function generateImage() {
    console.log('Maskify starting...');
    await loadModels();

    const bodyImageName = getRandomArrayElement(bodyUrls);
    const geraltImageName = getRandomArrayElement(geraltUrls);

    const bodyUrl = path.join(__dirname, `../images/bodies/${bodyImageName}.jpg`);
    const geraltUrl = path.join(__dirname, `../images/geralt/${geraltImageName}.png`);

    return maskify(bodyUrl, geraltUrl);
}
