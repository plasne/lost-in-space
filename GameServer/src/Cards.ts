import { es5ClassFix } from './es5ClassFix';
import { Card } from './Card';

@es5ClassFix()
export class Cards extends Array<Card> {
    // shuffle cards
    public shuffle() {
        for (let i = this.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
    }

    /** Call this before draw to ensure you will always get a card. */
    public reshuffleIfEmpty(discards: Cards) {
        if (this.length > 0) return;
        global.logger.info(
            `the library was empty, ${discards.length} cards shuffled back into the library from the discard pile.`
        );
        this.push(...discards);
        discards.length = 0;
        this.shuffle();
    }

    // draw the top card, removing it
    public draw(
        discards: Cards | undefined = undefined,
        hand: Cards | undefined = undefined
    ) {
        // reshuffle if a discards pile was provided
        if (discards) this.reshuffleIfEmpty(discards);

        // if a hand was provided, make sure it isn't full
        if (hand && hand.length >= 5) {
            global.logger.warn(
                `draw could not be performed because the player's hand was full.`
            );
            return;
        }

        // draw a card
        var card = this.pop();
        if (card == null) {
            global.logger.warn(
                `draw could not be performed because there were no cards in the deck.`
            );
            return;
        }
        global.logger.info(`card "${card.id} - ${card.title}" was drawn.`);

        // if appropriate, add the card to the hand
        if (hand) hand.push(card);

        return card;
    }
}
