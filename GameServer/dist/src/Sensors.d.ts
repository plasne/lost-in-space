import { PoweredSystem } from './PoweredSystem';
export declare class Sensors extends PoweredSystem {
    get prefix(): string;
    get detectEfficiency(): number;
    get emitEfficiency(): number;
    tick(): void;
    constructor();
}
