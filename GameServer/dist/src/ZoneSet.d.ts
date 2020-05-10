import { Zone } from './Zone';
export declare class ZoneSet {
    id: number;
    zones: Zone[];
    private random;
    generate(): void;
    constructor(id: number);
}
