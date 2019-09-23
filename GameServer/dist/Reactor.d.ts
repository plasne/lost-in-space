import { Ship } from './Ship';
import { PoweredSystem } from './PoweredSystem';
export declare class Reactor extends PoweredSystem {
    private _fuel;
    private _reserve;
    readonly prefix: string;
    readonly maxFuel: number;
    fuel: number;
    readonly maxReserve: number;
    reserve: number;
    readonly efficiency: number;
    tick(): void;
    constructor(ship: Ship);
}
