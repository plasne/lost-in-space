import { Tag } from './Tag';

export class Effect {
    public title: string;
    public tags: Tag[] = [];

    constructor(title: string) {
        this.title = title;
    }
}
