import { PoweredSystem } from './PoweredSystem';
export declare class Thrusters extends PoweredSystem {
    get prefix(): string;
    get agilityEfficiency(): number;
    get evadeEfficiency(): number;
    tick(): void;
    constructor();
}
