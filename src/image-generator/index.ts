import * as canvasPkg from 'canvas';
import * as faceapi from 'face-api.js';
import { loadModels, maskify } from './utils';

const { Canvas, Image, ImageData } = canvasPkg;
// @ts-ignore
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

export async function generateImage(
    bodyUrl: string,
    maskUrl: string,
    { shouldLoadModels = true, flipMask = false, maskShift = { x: 0, y: 0 } } = {}
) {
    if (shouldLoadModels) {
        await loadModels();
    }
    return maskify(bodyUrl, maskUrl, { flipMask, maskShift });
}
