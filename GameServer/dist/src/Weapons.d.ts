import { PoweredSystem } from './PoweredSystem';
export declare class Weapons extends PoweredSystem {
    private _charge;
    get prefix(): string;
    get efficiency(): number;
    get maxCharge(): number;
    get charge(): number;
    set charge(value: number);
    tick(): void;
    constructor();
}
