import { Effects } from './Effects';
import { Feature } from './Feature';
import { Reactor } from './Reactor';
import { Engine } from './Engine';
import { JumpEngine } from './JumpEngine';
import { Helm } from './Helm';
import { Thrusters } from './Thrusters';
import { Scanners } from './Scanners';
import { Sensors } from './Sensors';
import { Tactical } from './Tactical';
import { Weapons } from './Weapons';
import { BattleStations } from './BattleStations';
import { Shields } from './Shields';
export declare interface Ship {
    on(event: 'message', listener: (payload: any) => void): this;
}
export declare class Ship extends Feature {
    private _class;
    effects: Effects;
    helm: Helm;
    tactical: Tactical;
    reactor: Reactor;
    engine: Engine;
    jumpEngine: JumpEngine;
    thrusters: Thrusters;
    sensors: Sensors;
    scanners: Scanners;
    battleStations: BattleStations;
    weapons: Weapons;
    shields: Shields;
    type: string;
    get class(): number;
    get emit(): number;
    get detect(): number;
    get agility(): number;
    get thrust(): number;
    get speed(): number;
    tick(): void;
    constructor();
}
