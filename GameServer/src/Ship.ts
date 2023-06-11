import { Effects } from './Effects';
import { Feature } from './Feature';
import { Reactor } from './Reactor';
import { Engine } from './Engine';
import { JumpEngine } from './JumpEngine';
import { Helm } from './Helm';
import { Thrusters } from './Thrusters';
import { BoosterAction } from './Action';
import { Scanners } from './Scanners';
import { Sensors } from './Sensors';
import { Tactical } from './Tactical';
import { Weapons } from './Weapons';
import { BattleStations } from './BattleStations';
import { Shields } from './Shields';

export declare interface Ship {
    on(event: 'message', listener: (payload: any) => void): this;
}

export class Ship extends Feature {
    private _class: number = 2;

    // effects
    public effects: Effects = new Effects();

    // stations
    public helm: Helm;
    public tactical: Tactical;

    // powered-systems
    public reactor: Reactor;
    public engine: Engine;
    public jumpEngine: JumpEngine;
    public thrusters: Thrusters;
    public sensors: Sensors;
    public scanners: Scanners;
    public battleStations: BattleStations;
    public weapons: Weapons;
    public shields: Shields;

    public type: string = 'ship';

    get class(): number {
        return this._class;
    }

    get emit(): number {
        return this.effects.sum('emit') + this.class * 10;
    }

    get detect(): number {
        return this.effects.sum('detect');
    }

    get agility(): number {
        return this.effects.sum('agility');
    }

    get evade(): number {
        return this.effects.sum('evade');
    }

    get thrust(): number {
        return this.effects.sum('thrust');
    }

    public tick() {
        // decrement all effect lifetimes
        this.effects.decrement('lifetime', 1, true);

        // tick the subsystems
        this.reactor.tick();
        this.engine.tick();
        this.jumpEngine.tick();
        this.thrusters.tick();
        this.sensors.tick();
        this.scanners.tick();
        this.battleStations.tick();
        this.weapons.tick();
        this.shields.tick();

        // send updates after each tick
        this.helm.toInterface();
    }

    constructor() {
        super();

        // NOTE: the startup of some systems require the ability to apply effects, which requires
        //  the ship to be assigned to global.ship
        global.ship = this;

        // instantiate stations
        this.helm = new Helm();
        this.helm.action1 = new BoosterAction();
        this.tactical = new Tactical();

        // instantiate systems
        this.reactor = new Reactor();
        this.engine = new Engine();
        this.jumpEngine = new JumpEngine();
        this.thrusters = new Thrusters();
        this.sensors = new Sensors();
        this.scanners = new Scanners();
        this.battleStations = new BattleStations();
        this.weapons = new Weapons();
        this.shields = new Shields();

        // every 10 seconds: tick()
        setInterval(() => {
            this.tick();
        }, 10000);
    }
}
