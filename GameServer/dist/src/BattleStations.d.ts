import { PoweredSystem } from './PoweredSystem';
import { Card } from './Card';
export declare class BattleStations extends PoweredSystem {
    library: Card[];
    discards: Card[];
    hand: Card[];
    get prefix(): string;
    get interval(): number;
    private flip;
    tick(): void;
    constructor();
}
