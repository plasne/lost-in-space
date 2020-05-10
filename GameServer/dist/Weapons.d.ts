import { PoweredSystem } from './PoweredSystem';
import { Card } from './Card';
export declare class Weapons extends PoweredSystem {
    private _charge;
    private _queue;
    get prefix(): string;
    get efficiency(): number;
    get maxCharge(): number;
    get charge(): number;
    set charge(value: number);
    private fireEffect;
    private fire;
    enqueue(effect: Card): void;
    tick(): void;
    constructor();
}
