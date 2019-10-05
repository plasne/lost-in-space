import { ZoneSet } from './ZoneSet';
import { Zone } from './Zone';

type location = {
    set: ZoneSet;
    zone: Zone;
};

export class Map {
    private _sets: ZoneSet[] = [];
    private _zone?: Zone = undefined;

    // a zone set is comprised of 1-4 zones
    public get sets() {
        return this._sets;
    }

    // the ship's current position
    public get zone() {
        return this._zone;
    }
    public set zone(value: Zone | undefined) {
        this._zone = value;
    }

    // given a zoneId, find the setId
    public findSetId(zoneId: string): location | null {
        for (var zset of this.sets) {
            for (var zone of zset.zones) {
                if (zone.id == zoneId) {
                    return {
                        set: zset,
                        zone: zone
                    };
                }
            }
        }
        return null;
    }

    // moves the position of the ship forward 1 slot
    public advanceTo(zoneId: string) {
        // find the location
        var loc = this.findSetId(zoneId);
        if (!loc) throw new Error(`zoneId (${zoneId}) does not exist.`);

        // make sure the zoneset exists for this position and the next
        while (this.sets.length < loc.set.id + 2) {
            var newId = this.sets.length;
            var zset = new ZoneSet(newId);
            zset.generate();
            this.sets.push(zset);
        }

        // advance the ship
        this.zone = loc.zone;
    }

    // generates for the start of the game
    public generate() {
        var zset = new ZoneSet(0);
        zset.generate();
        this.sets.push(zset);
        var zoneId = zset.zones[0].id;
        this.advanceTo(zoneId);
    }
}
