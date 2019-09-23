import { Ship } from './Ship';
import { PoweredSystem } from './PoweredSystem';
export declare class Thrusters extends PoweredSystem {
    readonly prefix: string;
    readonly agility: number;
    readonly evade: number;
    readonly agilityEfficiency: number;
    readonly evadeEfficiency: number;
    tick(): void;
    constructor(ship: Ship);
}
