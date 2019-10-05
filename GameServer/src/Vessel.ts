import { Feature } from './Feature';
var generate = require('project-name-generator');

export class Vessel extends Feature {
    public type: string = 'vessel';
    public name: string = generate().spaced;
    public designation: string;

    private random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public position() {
        this.x = this.random(-90000, 90000);
        this.y = this.random(-8000, 8000);
        this.z = this.random(-90000, 90000);
    }

    public constructor(designation: string) {
        super();
        this.designation = designation;
    }
}
