import { LocalStorage } from 'node-localstorage';
import path from 'path';

export class ImageCounter {
    storage: LocalStorage;
    imageUrls: string[];

    constructor(imageUrls: string[], id: string) {
        this.imageUrls = imageUrls;
        this.storage = new LocalStorage(path.join(__dirname, `./${id}`));
    }

    getCounter() {
        return Number(this.storage.getItem('counter') ?? 0);
    }

    setCounter(number: number) {
        this.storage.setItem('counter', String(number));
    }

    getImagesLength() {
        return this.imageUrls.length;
    }

    increaseCounter() {
        let counter = this.getCounter();
        const length = this.getImagesLength() - 1;
        counter = clamp(++counter, length);
        this.setCounter(counter);
    }

    getCurrentImageUrl() {
        let counter = this.getCounter();
        return this.imageUrls[counter];
    }
}

const clamp = (number: number, max: number) => (number > max ? 0 : number);
