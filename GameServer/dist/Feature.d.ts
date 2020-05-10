import { TelemetryPayload } from './Scanners';
export declare abstract class Feature {
    abstract type: string;
    private _range;
    id: string;
    x: number;
    y: number;
    z: number;
    hx: number;
    hy: number;
    hz: number;
    s2v: string;
    v2s: string;
    get range(): number;
    calcRange(): void;
    receiveTelemetry(payload: TelemetryPayload): void;
}
