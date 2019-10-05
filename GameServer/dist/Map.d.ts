import { ZoneSet } from './ZoneSet';
import { Zone } from './Zone';
declare type location = {
    set: ZoneSet;
    zone: Zone;
};
export declare class Map {
    private _sets;
    private _zone?;
    readonly sets: ZoneSet[];
    zone: Zone | undefined;
    findSetId(zoneId: string): location | null;
    advanceTo(zoneId: string): void;
    generate(): void;
}
export {};
