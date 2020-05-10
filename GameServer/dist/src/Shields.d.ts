import { PoweredSystem } from './PoweredSystem';
export declare class Shields extends PoweredSystem {
    private _fore;
    private _aft;
    private _port;
    private _starboard;
    get prefix(): string;
    get efficiency(): number;
    get maxShields(): number;
    get fore(): number;
    set fore(value: number);
    get aft(): number;
    set aft(value: number);
    get port(): number;
    set port(value: number);
    get starboard(): number;
    set starboard(value: number);
    tick(): void;
    constructor();
}
