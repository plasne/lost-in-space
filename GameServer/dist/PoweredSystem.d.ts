import { Ship } from './Ship';
export declare abstract class PoweredSystem {
    private _ship;
    private _maxPower;
    private _power;
    private _pendingPower;
    abstract prefix: string;
    protected readonly ship: Ship;
    readonly maxPower: number;
    power: number;
    pendingPower: number;
    tick(): void;
    constructor(ship: Ship);
}
