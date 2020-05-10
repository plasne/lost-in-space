import { Station } from './Station';
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
    action1IsAvailable: boolean;
    action2IsAvailable: boolean;
    action3IsAvailable: boolean;
    maxShields: number;
    foreShields: number;
    aftShields: number;
    portShields: number;
    starShields: number;
    reserve: number;
    maxReserve: number;
}
export declare class ToMainViewScreen {
    speed: number;
    yaw: number;
    pitch: number;
}
export declare class Helm extends Station {
    get prefix(): string;
    toInterface(): void;
    fromInterface(from: FromHelmInterface): void;
}
