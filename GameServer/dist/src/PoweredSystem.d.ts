export declare abstract class PoweredSystem {
    private _maxPower;
    private _power;
    private _pendingPower;
    abstract prefix: string;
    get maxPower(): number;
    get power(): number;
    set power(value: number);
    get pendingPower(): number;
    set pendingPower(value: number);
    tick(): void;
}
