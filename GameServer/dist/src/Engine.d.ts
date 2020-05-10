import { PoweredSystem } from './PoweredSystem';
export declare class Engine extends PoweredSystem {
    get prefix(): string;
    get thrustEfficiency(): number;
    get emitEfficiency(): number;
    tick(): void;
    constructor();
}
