import { chromium } from 'playwright';
import config from '../config';

const textSelector = config.TEXT_SELECTOR!;
const url = config.GENERATE_TEXT_SERVICE!;

const query = 'Геральт заходит в бар.';

export const generateText = async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);

    await page.click('button');
    await page.fill('textarea', query);
    await page.click('button');
    await page.waitForSelector(textSelector);
    const response = await page.$eval(textSelector, (el: any) => el.innerText);
    await browser.close();

    return response as string;
};
