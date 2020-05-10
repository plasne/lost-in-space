import { Tag } from './Tag';
export declare class Card {
    id: number;
    title: string | undefined;
    draw: string | undefined;
    play: string | undefined;
    tags: Tag[];
    static from(json: any): Card;
}
