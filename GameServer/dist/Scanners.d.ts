import { PoweredSystem } from './PoweredSystem';
import { Feature } from './Feature';
export declare class TelemetryPayload {
    id: string;
    posx: number;
    posy: number;
    posz: number;
    rotx: number;
    roty: number;
    rotz: number;
    s2v: string;
    v2s: string;
}
export declare class Scanners extends PoweredSystem {
    slots: (Feature | null | undefined)[];
    get prefix(): string;
    get efficiency(): number;
    private assignToTrackSlot;
    track(): void;
    scan(): void;
    tick(): void;
    constructor();
}
