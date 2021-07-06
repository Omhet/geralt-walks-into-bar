import * as faceapi from 'face-api.js';
import * as canvasPkg from 'canvas';
import path from 'path';

export const getRandomArrayElement = (arr: any[]) => {
    const index = Math.floor(arr.length * Math.random());
    return arr[index];
};

export const detectFace = async (image: any) => {
    const detection = await faceapi
        .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(true);

    if (!detection) {
        throw new Error('Could not detect face');
    }

    return detection;
};

export const loadModels = async () => {
    const modelsPath = path.join(__dirname, '../models');

    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromDisk(modelsPath),
        faceapi.nets.faceLandmark68TinyNet.loadFromDisk(modelsPath),
    ]).catch((error) => {
        console.error(error);
    });
    console.log('models loaded');
};

export const maskify = async (bodyUrl: string, maskUrl: string, { flipMask = false, maskShift = { x: 0, y: 0 } }) => {
    console.log(`Maskifying "${bodyUrl}" image, with "${maskUrl}" mask`);

    const canvasWidthBase = 400;
    const bodyImage = await canvasPkg.loadImage(bodyUrl);
    const maskImage = await canvasPkg.loadImage(maskUrl);

    const ratio = bodyImage.height / bodyImage.width;
    const canvasWidth = ratio < 1 ? canvasWidthBase * 2 : canvasWidthBase;
    const canvasHeight = Math.round(canvasWidth * ratio);

    const canvas = canvasPkg.createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bodyImage, 0, 0, canvasWidth, canvasHeight);

    const {
        detection: { box },
    } = await detectFace(canvas);
    const { x, y, width } = box;

    const maskWidth = width * 1.05;
    const maskHeight = (maskImage.height / maskImage.width) * maskWidth;
    const maskX = x + getPercent(maskShift.x, maskWidth);
    const maskY = y - maskHeight * 0.3 + getPercent(maskShift.y, maskHeight);
    const halfMaskWidth = maskWidth / 2;
    const halfMaskHeight = maskHeight / 2;
    ctx.translate(maskX + halfMaskWidth, maskY + halfMaskHeight);
    if (flipMask) ctx.scale(-1, 1);
    ctx.drawImage(maskImage, -halfMaskWidth, -halfMaskHeight, maskWidth, maskHeight);

    const buffer = canvas.toBuffer('image/jpeg');
    if (!buffer) {
        throw new Error('Could not create image buffer');
    }

    return buffer;
};

const getPercent = (a: number, b: number) => (a / 100) * b;
