import { Tags } from './Tags';

export class Effect {
    public title: string;
    public tags: Tags = new Tags();

    constructor(title: string) {
        this.title = title;
    }
}
