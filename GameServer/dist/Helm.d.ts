import { Ship } from './Ship';
export declare class FromHelmInterface {
    throttle: number;
    yaw: number;
    pitch: number;
    enginePower: number;
    jumpPower: number;
    thrusterPower: number;
}
export declare class ToHelmInterface {
    enginePower: number;
    enginePendingPower: number;
    jumpPower: number;
    jumpPendingPower: number;
    thrusterPower: number;
    thrusterPendingPower: number;
    crew: number;
    crewIsEvac: boolean;
    jumpIsAvailable: boolean;
    upgrade1IsAvailable: boolean;
    upgrade2IsAvailable: boolean;
    upgrade3IsAvailable: boolean;
    foreShields: number;
    maxForeShields: number;
    aftShields: number;
    maxAftShields: number;
    portShields: number;
    maxPortShields: number;
    starShields: number;
    maxStarShields: number;
    reserve: number;
    maxReserve: number;
}
export declare class ToMainViewScreen {
    throttle: number;
    yaw: number;
    pitch: number;
}
export declare class Helm {
    private _ship;
    protected readonly ship: Ship;
    toInterface(): void;
    fromInterface(from: FromHelmInterface): void;
    constructor(ship: Ship);
}
