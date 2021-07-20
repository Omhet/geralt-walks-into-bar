import axios from 'axios';
import config from '../config';

const baseUrl = 'https://api.imgbb.com/1/upload';

export const uploadImage = async (imageBuffer: Buffer): Promise<string> => {
    const {
        data: {
            data: { url: imageUrl },
        },
    } = await axios({
        url: baseUrl,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: formUrlEncoded({
            key: config.UPLOAD_PHOTO_API_KEY,
            image: imageBuffer.toString('base64'),
        }),
        method: 'POST',
    });

    return imageUrl;
};

const formUrlEncoded = (x: any) => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');
