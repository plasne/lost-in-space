import { PoweredSystem } from './PoweredSystem';
import { Card } from './Card';
import { Cards } from './Cards';
var fs = require('fs');

export class BattleStations extends PoweredSystem {
    private flipIndex = 0;
    private flipAccumulation = 0;
    private effectivePower = 0;

    public onHold: boolean = false;
    public library: Cards = new Cards();
    public discards: Cards = new Cards();
    public hand: Cards = new Cards();
    public effects: Cards = new Cards();

    get prefix(): string {
        return 'battle';
    }

    get interval() {
        return 18000 - this.effectivePower * 2000;
    }

    private flip() {
        // flip a card only if we are not on hold
        if (!this.onHold) {
            // increment
            this.flipAccumulation += 1000;

            // if time, draw a new card
            if (this.flipAccumulation >= this.interval) {
                this.flipAccumulation = 0;
                var newCard = this.library.draw(this.discards);
                if (newCard) {
                    var oldCard = this.hand[this.flipIndex];
                    this.hand[this.flipIndex] = newCard;
                    oldCard.isAvailable = true;
                    this.discards.push(oldCard);
                    this.flipIndex++;
                    if (this.flipIndex > 4) this.flipIndex = 0;
                }
            }
        }

        // do it again in a bit
        setTimeout(() => {
            this.flip();
        }, 1000);
    }

    public getAvailableCardOfId(id: number) {
        var card = this.hand.find((c) => c.id === id && c.isAvailable);
        return card;
    }

    public getEffect(id: number) {
        var card = this.effects.find((c) => c.id === id);
        return card;
    }

    public tick() {
        super.tick();

        // consume power, flip cards
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            this.effectivePower = this.power;
            global.logger.debug(
                `consumed ${this.power} power to make the flip card interval ${this.interval} ms, leaving ${global.ship.reactor.reserve} power in the reactor.`
            );
        } else {
            // hard shutdown the jump engine
            this.power = 0;
            this.pendingPower = 0;
            global.logger.debug(
                `the battle stations were shutdown because there was not enough reserve power in the reactor.`
            );
        }
    }

    constructor() {
        super();

        // create a filler deck in case it takes a while to load
        this.hand.push(new Card());
        this.hand.push(new Card());
        this.hand.push(new Card());
        this.hand.push(new Card());
        this.hand.push(new Card());

        // load the players deck
        fs.readFile('./decks/player.json', (err: Error, raw: string) => {
            if (!err) {
                var deck = JSON.parse(raw);

                // add each card to the library or effects
                for (var json of deck.sets[0].cards) {
                    var card = Card.from(json);
                    if (card.tags.contains('effect')) {
                        this.effects.push(card);
                    } else {
                        this.library.push(card);
                    }
                }

                // shuffle the library
                this.library.shuffle();

                // deal a hand
                for (let i = 0; i < 5; i++) {
                    var card = this.library.draw(this.discards);
                    this.hand[i] = card;
                }

                // start the flipping of cards
                setTimeout(() => {
                    this.flip();
                }, 1000);
            } else {
                global.logger.error(err);
            }
        });
    }
}
