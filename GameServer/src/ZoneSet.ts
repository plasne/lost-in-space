import { Zone } from './Zone';

export class ZoneSet {
    public id: number;
    public zones: Zone[] = [];

    private random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public generate() {
        // between 1 and 4 zones per set
        var count = this.random(1, 4);
        global.logger.debug(`generating ${count} zones in set ${this.id}...`);
        for (var i = 0; i < count; i++) {
            var zone = new Zone();
            zone.generate();
            this.zones.push(zone);
        }
    }

    public constructor(id: number) {
        this.id = id;
    }
}
