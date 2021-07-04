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

    getNextImageUrl() {
        let counter = this.getCounter();

        const url = this.imageUrls[counter++];

        counter = counter > this.imageUrls.length - 1 ? 0 : counter;
        this.setCounter(counter);

        return url;
    }

    getCurrentImageUrl() {
        let counter = this.getCounter();
        return this.imageUrls[counter];
    }
}
