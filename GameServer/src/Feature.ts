import { Guid } from 'guid-typescript';

export abstract class Feature {
    public abstract type: string;
    public id: string = Guid.create().toString();
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;
}
