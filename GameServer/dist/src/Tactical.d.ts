import { Station } from './Station';
export declare class FromTacticalInterface {
    battleStationsPower: number;
    weaponChargePower: number;
    shieldsPower: number;
}
export declare class ToTacticalInterface {
    battleStationsPower: number;
    battleStationsPendingPower: number;
    weaponChargePower: number;
    weaponChargePendingPower: number;
    shieldsPower: number;
    shieldsPendingPower: number;
    targetSlot1: string;
    targetSlot2: string;
    targetSlot3: string;
    targetSlot4: string;
    targetSlot5: string;
    maxShields: number;
    foreShields: number;
    aftShields: number;
    portShields: number;
    starShields: number;
    reserve: number;
    maxReserve: number;
}
export declare class Tactical extends Station {
    battleStationsPower: number;
    battleStationsPendingPower: number;
    weaponChargePower: number;
    weaponChargePendingPower: number;
    shieldsPower: number;
    shieldsPendingPower: number;
    get prefix(): string;
    private getTargetSlot;
    toInterface(): void;
    fromInterface(from: FromTacticalInterface): void;
}