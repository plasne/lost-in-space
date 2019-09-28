import { Feature } from './Feature';
export declare class Planet extends Feature {
    type: string;
    size: number;
    material: number;
    x: number;
    y: number;
    z: number;
    private random;
    position(): void;
    constructor();
}
