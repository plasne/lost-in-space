import { Feature } from './Feature';
export declare class Vessel extends Feature {
    type: string;
    name: string;
    designation: string;
    private random;
    position(): void;
    constructor(designation: string);
}
