export abstract class PoweredSystem {
    private _maxPower: number = 8;
    private _power: number = 0;
    private _pendingPower: number = 0;
    abstract prefix: string;

    // maximum power
    get maxPower(): number {
        return (
            global.ship.effects.sum(`${this.prefix}.max-power`) + this._maxPower
        );
    }

    // current power
    get power(): number {
        return this._power;
    }
    set power(value: number) {
        if (value < 0) value = 0;
        if (value > this.maxPower) value = this.maxPower;
        this._power = value;
    }

    // current power
    get pendingPower(): number {
        return this._pendingPower;
    }
    set pendingPower(value: number) {
        this._pendingPower = value;
    }

    public tick() {
        // convert pending-power into power
        if (this.pendingPower > 0) {
            this.pendingPower--;
            this.power++;
        } else if (this.pendingPower < 0) {
            this.pendingPower++;
            this.power--;
        }
    }
}
