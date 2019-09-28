import { Feature } from './Feature';
import { Planet } from './Planet';

export class Zone {
    public features: Feature[] = [];

    public generate() {
        // this method picks the features, plots, etc. for a new zone

        // generate features
        var planet = new Planet();
        planet.position();
        this.features.push(planet);
    }
}
