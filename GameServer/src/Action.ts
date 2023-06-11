export abstract class Action {
    public abstract id: string;

    public get isAvailable() {
        return !global.ship.effects.contains(`suppress:${this.id}`);
    }

    public abstract activate(): void;

    public tick(): void { }
}

export class BoosterAction extends Action {
    public get id(): string {
        return 'booster';
    }

    public activate(): void {
        if (!this.isAvailable) return;
        if (global.ship.reactor.reserve < 50) return;
        global.ship.reactor.reserve -= 50;
        global.ship.effects.add('Booster', 'thrust', 1000, 6); // on for 1 min
        global.ship.effects.add(
            'Booster Suppression',
            'suppress:booster',
            1,
            30
        ); // reset after 5 min
    }
}
