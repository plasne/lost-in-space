import { Feature } from './Feature';

export class Planet extends Feature {
    public type: string = 'planet';
    public name: string;
    public size: number;
    public material: number;

    private random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public position() {
        this.x = this.random(-90000, 90000);
        this.y = this.random(-8000, 8000);
        this.z = this.random(-90000, 90000);
    }

    public constructor() {
        super();
        this.name = global.naming.greek;
        this.size = this.random(2000, 6000);
        this.material = this.random(0, 6);
    }
}
