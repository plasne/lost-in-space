import { PoweredSystem } from './PoweredSystem';

export class Shields extends PoweredSystem {
    private _fore: number = 0;
    private _aft: number = 0;
    private _port: number = 0;
    private _starboard: number = 0;

    get prefix(): string {
        return 'shields';
    }

    // efficiency rating = the amount of shields generated in each zone per power
    get efficiency(): number {
        return global.ship.effects.sum(`${this.prefix}.efficiency`);
    }

    // maximum shields
    get maxShields(): number {
        return global.ship.effects.sum(`${this.prefix}.max-shields`);
    }

    // fore-shields
    get fore(): number {
        return this._fore;
    }
    set fore(value: number) {
        if (value < 0) value = 0;
        if (value > this.maxShields) value = this.maxShields;
        this._fore = value;
    }

    // aft-shields
    get aft(): number {
        return this._aft;
    }
    set aft(value: number) {
        if (value < 0) value = 0;
        if (value > this.maxShields) value = this.maxShields;
        this._aft = value;
    }

    // port-shields
    get port(): number {
        return this._port;
    }
    set port(value: number) {
        if (value < 0) value = 0;
        if (value > this.maxShields) value = this.maxShields;
        this._port = value;
    }

    // starboard-shields
    get starboard(): number {
        return this._starboard;
    }
    set starboard(value: number) {
        if (value < 0) value = 0;
        if (value > this.maxShields) value = this.maxShields;
        this._starboard = value;
    }

    public tick() {
        super.tick();

        // consume power, produce detect and emit
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            var produceShielding = this.power * this.efficiency;
            this.fore += produceShielding;
            this.aft += produceShielding;
            this.port += produceShielding;
            this.starboard += produceShielding;
            global.logger.debug(
                `consumed ${this.power} power to produce ${produceShielding} shielding in each zone, leaving ${global.ship.reactor.reserve} power in the reactor.`
            );
        } else {
            // hard shutdown
            this.power = 0;
            this.pendingPower = 0;
            global.logger.debug(
                `shield regeneration was shutdown because there was not enough reserve power in the reactor.`
            );
        }
    }

    constructor() {
        super();

        // establish starting effects
        global.ship.effects.add(
            'Shields Efficiency',
            `${this.prefix}.efficiency`,
            1.0
        );
    }
}
