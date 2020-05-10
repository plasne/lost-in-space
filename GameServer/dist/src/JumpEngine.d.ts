import { PoweredSystem } from './PoweredSystem';
export declare class JumpEngine extends PoweredSystem {
    quantum: number;
    get prefix(): string;
    get efficiency(): number;
    tick(): void;
    constructor();
}
