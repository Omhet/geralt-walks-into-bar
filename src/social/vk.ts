import axios from 'axios';
import { Telegraf } from 'telegraf';
import config from '../config';

const url = `https://api.vk.com/method/wall.post/`;

export const sendToVK = async (imageUrl: string, text: string) => {
    console.log('Sending to VK');
    const { data } = await axios(url, {
        method: 'POST',
        params: {
            access_token: config.SOCIAL_VK_API_TOKEN,
            owner_id: config.SOCIAL_VK_CHANNEL_ID,
            message: text,
            attachments: imageUrl,
            from_group: 1,
            v: 5.131,
        },
    });
    console.log(data);

    console.log('Sending to VK: Done');
};
