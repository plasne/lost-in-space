import { Ship } from './Ship';
import { PoweredSystem } from './PoweredSystem';
export declare class JumpEngine extends PoweredSystem {
    private _quantum;
    readonly prefix: string;
    readonly efficiency: number;
    quantum: number;
    tick(): void;
    constructor(ship: Ship);
}
