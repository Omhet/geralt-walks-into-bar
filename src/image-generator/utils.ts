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

    const score = detection.detection.score;
    console.log(`Score: ${score}`);
    if (score < 0.85) throw new Error('Non confident about face');

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

export const maskify = async (bodyUrl: string, geraltUrl: string) => {
    console.log(`Maskifying "${bodyUrl}" image, with "${geraltUrl}" mask`);

    const canvasWidthBase = 600;
    try {
        const bodyImage = await canvasPkg.loadImage(bodyUrl);
        const geraltImage = await canvasPkg.loadImage(geraltUrl);

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

        const geraltWidth = width * 1.05;
        const geraltHeight = (geraltImage.height / geraltImage.width) * geraltWidth;
        const geraltX = x;
        const geraltY = y - geraltHeight * 0.3;
        ctx.drawImage(geraltImage, geraltX, geraltY, geraltWidth, geraltHeight);

        return canvas.toBuffer('image/jpeg');
    } catch (error) {
        console.log(error);
    }
};
