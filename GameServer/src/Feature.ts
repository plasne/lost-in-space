import { Guid } from 'guid-typescript';
import { TelemetryPayload } from './Scanners';

export abstract class Feature {
    public abstract type: string;
    private _range: number = 0;

    public id: string = Guid.create().toString();
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;
    public hx: number = 0;
    public hy: number = 0;
    public hz: number = 0;
    public s2v: string = '';
    public v2s: string = '';

    get range() {
        return this._range;
    }

    public calcRange() {
        this._range = Math.sqrt(
            Math.pow(this.x - global.ship.x, 2) +
                Math.pow(this.y - global.ship.y, 2) +
                Math.pow(this.z - global.ship.z, 2)
        );
    }

    public receiveTelemetry(payload: TelemetryPayload) {
        if (this.id === payload.id) {
            this.x = payload.posx;
            this.y = payload.posy;
            this.z = payload.posz;
            this.hx = payload.rotx;
            this.hy = payload.roty;
            this.hz = payload.rotz;
            this.s2v = payload.s2v;
            this.v2s = payload.v2s;
        }
    }
}
