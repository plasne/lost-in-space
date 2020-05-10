import { Feature } from './Feature';
var generate = require('project-name-generator');

export class Vessel extends Feature {
    private classification: string = '';
    private icon: string = '';

    private hull: number = 0;
    private shieldFore: number = 0;
    private shieldAft: number = 0;
    private shieldPort: number = 0;
    private shieldStarboard: number = 0;
    private speed: number = 0;
    private crew: number = 0;
    private hit: number = 0;
    private crit: number = 0;
    private assault: number = 0;
    private evade: number = 0;
    private armor: number = 0;
    private resist: number = 0;
    private emit: number = 0;
    private detect: number = 0;
    private hack: number = 0;

    private hullIsVisible: boolean = false;
    private shieldForeIsVisible: boolean = false;
    private shieldAftIsVisible: boolean = false;
    private shieldPortIsVisible: boolean = false;
    private shieldStarboardIsVisible: boolean = false;
    private speedIsVisible: boolean = false;
    private crewIsVisible: boolean = false;
    private hitIsVisible: boolean = false;
    private critIsVisible: boolean = false;
    private assaultIsVisible: boolean = false;
    private evadeIsVisible: boolean = false;
    private armorIsVisible: boolean = false;
    private resistIsVisible: boolean = false;
    private emitIsVisible: boolean = false;
    private detectIsVisible: boolean = false;
    private hackIsVisible: boolean = false;

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

    public stats() {
        // TODO: remove this
        this.hullIsVisible = true;
        this.shieldForeIsVisible = true;
        this.shieldAftIsVisible = true;
        this.shieldPortIsVisible = true;
        this.shieldStarboardIsVisible = true;
        this.speedIsVisible = true;
        this.crewIsVisible = true;
        this.hitIsVisible = true;
        this.critIsVisible = true;
        this.assaultIsVisible = true;
        this.evadeIsVisible = true;
        this.armorIsVisible = true;
        this.resistIsVisible = true;
        this.emitIsVisible = true;
        this.detectIsVisible = true;
        this.hackIsVisible = true;

        const stats: string[] = [];
        stats.push(this.name);
        stats.push(this.classification);
        stats.push(this.icon);
        stats.push(this.v2s);
        stats.push(this.s2v);
        stats.push(this.range.toString());
        stats.push(this.hullIsVisible ? this.hull.toString() : '?');
        stats.push(this.shieldForeIsVisible ? this.shieldFore.toString() : '?');
        stats.push(this.shieldAftIsVisible ? this.shieldAft.toString() : '?');
        stats.push(this.shieldPortIsVisible ? this.shieldPort.toString() : '?');
        stats.push(
            this.shieldStarboardIsVisible
                ? this.shieldStarboard.toString()
                : '?'
        );
        stats.push(this.speedIsVisible ? this.speed.toString() : '?');
        stats.push(this.crewIsVisible ? this.crew.toString() : '?');
        stats.push(this.hitIsVisible ? this.hit.toString() : '?');
        stats.push(this.critIsVisible ? this.crit.toString() : '?');
        stats.push(this.assaultIsVisible ? this.assault.toString() : '?');
        stats.push(this.evadeIsVisible ? this.evade.toString() : '?');
        stats.push(this.armorIsVisible ? this.armor.toString() : '?');
        stats.push(this.resistIsVisible ? this.resist.toString() : '?');
        stats.push(this.emitIsVisible ? this.emit.toString() : '?');
        stats.push(this.detectIsVisible ? this.detect.toString() : '?');
        stats.push(this.hackIsVisible ? this.hack.toString() : '?');
        return stats.join(',');
    }

    private generateStatsGreyFrigate() {
        this.classification = 'frigate';
        this.icon = 'ship-gec-frigate';
        this.hull = 75;
        this.shieldFore = 50;
        this.shieldAft = 30;
        this.shieldPort = 30;
        this.shieldStarboard = 30;
        this.speed = 50;
        this.crew = 10;
        this.hit = 90;
        this.crit = 10;
        this.assault = 10;
        this.evade = 20;
        this.armor = 0;
        this.resist = 0;
        this.emit = 40;
        this.detect = 40;
        this.hack = 0;
    }

    private generateStats() {
        switch (this.designation) {
            case 'grey-frigate':
                this.generateStatsGreyFrigate();
                break;
        }
    }

    public constructor(designation: string) {
        super();
        this.designation = designation;
        this.generateStats();
    }
}
