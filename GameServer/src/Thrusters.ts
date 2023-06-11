import { PoweredSystem } from './PoweredSystem';

export class Thrusters extends PoweredSystem {
    get prefix(): string {
        return 'thrusters';
    }

    // agility is how maneuverable the ship is
    /*
    get agility(): number {
        return this.ship.effects.sum(`${this.prefix}.agility`);
    }

    // evade is how likely the ship is to completely avoid damage
    get evade(): number {
        return this.ship.effects.sum(`${this.prefix}.evade`);
    }
    */

    // efficiency rating = the amount of agility produced per power
    get agilityEfficiency(): number {
        return global.ship.effects.sum(`${this.prefix}.agility-efficiency`);
    }

    // efficiency rating = the amount of evade produced per power
    get evadeEfficiency(): number {
        return global.ship.effects.sum(`${this.prefix}.evade-efficiency`);
    }

    public tick() {
        super.tick();

        // consume power, produce agility and evade
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            var produceAgility = this.power * this.agilityEfficiency;
            var produceEvade = this.power * this.evadeEfficiency;
            global.ship.effects.add(
                'Thruster Agility',
                'agility',
                produceAgility,
                1
            );
            global.ship.effects.add(
                'Thruster Evade',
                'evade',
                produceEvade,
                1
            );
            global.logger.debug(
                `consumed ${this.power} power to produce ${produceAgility} agility and ${produceEvade} evade, leaving ${global.ship.reactor.reserve} power in the reactor.`
            );
        } else {
            // hard shutdown the engines
            this.power = 0;
            this.pendingPower = 0;
            global.logger.debug(
                `the engines were shutdown because there was not enough reserve power in the reactor.`
            );
        }
    }

    constructor() {
        super();

        // establish starting effects
        global.ship.effects.add(
            'Thruster Agility Efficiency',
            `${this.prefix}.agility-efficiency`,
            1000.0
        );
        global.ship.effects.add(
            'Thruster Evade Efficiency',
            `${this.prefix}.evade-efficiency`,
            1.0
        );
    }
}
