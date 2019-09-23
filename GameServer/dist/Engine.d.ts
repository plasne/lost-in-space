import { Ship } from './Ship';
import { PoweredSystem } from './PoweredSystem';
export declare class Engine extends PoweredSystem {
    readonly prefix: string;
    readonly thrust: number;
    readonly efficiency: number;
    tick(): void;
    constructor(ship: Ship);
}
