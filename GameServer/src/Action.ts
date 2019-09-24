import { Ship } from './Ship';

export abstract class Action {
    private _ship: Ship;

    protected get ship(): Ship {
        return this._ship;
    }

    public abstract id: string;

    public get isAvailable() {
        return !this.ship.effects.contains(`suppress:${this.id}`);
    }

    public abstract activate(): void;

    public tick(): void {}

    constructor(ship: Ship) {
        this._ship = ship;
    }
}

export class BoosterAction extends Action {
    public get id(): string {
        return 'booster';
    }

    public activate(): void {
        if (!this.isAvailable) return;
        if (this.ship.reactor.reserve < 50) return;
        this.ship.reactor.reserve -= 50;
        this.ship.effects.add('Booster', 'engine.booster', 100000, 6); // on for 1 min
        this.ship.effects.add('Booster Suppression', 'suppress:booster', 1, 30); // reset after 5 min
    }
}
