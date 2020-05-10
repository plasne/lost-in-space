import { Tags } from './Tags';
export declare class Card {
    id: number;
    title: string | undefined;
    draw: string | undefined;
    play: string | undefined;
    tags: Tags;
    isAvailable: boolean;
    static from(json: any): Card;
    clone(): Card;
}
