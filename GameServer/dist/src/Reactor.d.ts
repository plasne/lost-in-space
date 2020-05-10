import { PoweredSystem } from './PoweredSystem';
export declare class Reactor extends PoweredSystem {
    private _fuel;
    private _reserve;
    get prefix(): string;
    get maxFuel(): number;
    get fuel(): number;
    set fuel(value: number);
    get maxReserve(): number;
    get reserve(): number;
    set reserve(value: number);
    get efficiency(): number;
    tick(): void;
    constructor();
}
