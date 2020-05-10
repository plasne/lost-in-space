import { Action } from './Action';
export declare abstract class Station {
    private _action1?;
    private _action2?;
    private _action3?;
    abstract prefix: string;
    get action1(): Action | undefined;
    set action1(value: Action | undefined);
    get action2(): Action | undefined;
    set action2(value: Action | undefined);
    get action3(): Action | undefined;
    set action3(value: Action | undefined);
    tick(): void;
    click(action: string): void;
}
