import { Ship } from './Ship';
import { PoweredSystem } from './PoweredSystem';
export declare class Engine extends PoweredSystem {
    readonly prefix: string;
    readonly thrust: number;
    readonly booster: number;
    readonly efficiency: number;
    speed(throttle: number): number;
    tick(): void;
    constructor(ship: Ship);
}
