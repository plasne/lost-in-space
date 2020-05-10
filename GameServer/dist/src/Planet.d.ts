import { Feature } from './Feature';
export declare class Planet extends Feature {
    type: string;
    name: string;
    size: number;
    material: number;
    private random;
    position(): void;
    constructor();
}
