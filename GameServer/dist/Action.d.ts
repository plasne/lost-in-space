import { Ship } from './Ship';
export declare abstract class Action {
    private _ship;
    protected readonly ship: Ship;
    abstract id: string;
    readonly isAvailable: boolean;
    abstract activate(): void;
    tick(): void;
    constructor(ship: Ship);
}
export declare class BoosterAction extends Action {
    readonly id: string;
    activate(): void;
}
