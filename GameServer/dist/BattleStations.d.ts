import { PoweredSystem } from './PoweredSystem';
import { Card } from './Card';
import { Cards } from './Cards';
export declare class BattleStations extends PoweredSystem {
    private flipIndex;
    private flipAccumulation;
    private effectivePower;
    onHold: boolean;
    library: Cards;
    discards: Cards;
    hand: Cards;
    effects: Cards;
    get prefix(): string;
    get interval(): number;
    private flip;
    getAvailableCardOfId(id: number): Card | undefined;
    getEffect(id: number): Card | undefined;
    tick(): void;
    constructor();
}
