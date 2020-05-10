import { Card } from './Card';
export declare class Cards extends Array<Card> {
    shuffle(): void;
    /** Call this before draw to ensure you will always get a card. */
    reshuffleIfEmpty(discards: Cards): void;
    draw(discards?: Cards | undefined, hand?: Cards | undefined): Card | undefined;
}
