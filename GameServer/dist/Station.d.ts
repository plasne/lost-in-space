import { Ship } from './Ship';
import { Action } from './Action';
export declare abstract class Station {
    private _ship;
    private _action1?;
    private _action2?;
    private _action3?;
    abstract prefix: string;
    protected readonly ship: Ship;
    action1: Action | undefined;
    action2: Action | undefined;
    action3: Action | undefined;
    tick(): void;
    click(action: string): void;
    constructor(ship: Ship);
}
