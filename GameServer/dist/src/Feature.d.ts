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
    get range(): number;
    calcRange(): void;
    receiveTelemetry(payload: TelemetryPayload): void;
}
