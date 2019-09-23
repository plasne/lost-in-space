import { Ship } from './Ship';

export class FromHelmInterface {
    public throttle: number = 0.0;
    public yaw: number = 0.0;
    public pitch: number = 0.0;
    public enginePower: number = 0;
    public jumpPower: number = 0;
    public thrusterPower: number = 0;
}

export class ToHelmInterface {
    public enginePower: number = 0;
    public enginePendingPower: number = 0;
    public jumpPower: number = 0;
    public jumpPendingPower: number = 0;
    public thrusterPower: number = 0;
    public thrusterPendingPower: number = 0;
    public crew: number = 0;
    public crewIsEvac: boolean = false;
    public jumpIsAvailable: boolean = false;
    public upgrade1IsAvailable: boolean = false;
    public upgrade2IsAvailable: boolean = false;
    public upgrade3IsAvailable: boolean = false;
    public foreShields: number = 0;
    public maxForeShields: number = 0;
    public aftShields: number = 0;
    public maxAftShields: number = 0;
    public portShields: number = 0;
    public maxPortShields: number = 0;
    public starShields: number = 0;
    public maxStarShields: number = 0;
    public reserve: number = 0;
    public maxReserve: number = 0;
}

export class ToMainViewScreen {
    public throttle: number = 0.0;
    public yaw: number = 0.0;
    public pitch: number = 0.0;
}

export class Helm {
    private _ship: Ship;

    // reference to the ship
    protected get ship(): Ship {
        return this._ship;
    }

    public toInterface() {
        var clients = this.ship.server.clients.filter(
            c => c.id != 'mainViewScreen'
        );
        var toHelmInterface: ToHelmInterface = {
            enginePower: this.ship.engine.power,
            enginePendingPower: this.ship.engine.pendingPower,
            jumpPower: this.ship.jumpEngine.power,
            jumpPendingPower: this.ship.jumpEngine.pendingPower,
            thrusterPower: this.ship.thrusters.power,
            thrusterPendingPower: this.ship.thrusters.pendingPower,
            crew: 100,
            crewIsEvac: true,
            jumpIsAvailable: false,
            upgrade1IsAvailable: false,
            upgrade2IsAvailable: false,
            upgrade3IsAvailable: false,
            foreShields: 3,
            maxForeShields: 4,
            aftShields: 3,
            maxAftShields: 3,
            portShields: 3,
            maxPortShields: 4,
            starShields: 3,
            maxStarShields: 4,
            reserve: this.ship.reactor.reserve,
            maxReserve: this.ship.reactor.maxReserve
        };
        for (var client of clients) {
            this.ship.server.tell(client, 'helm', toHelmInterface);
        }
    }

    public fromInterface(from: FromHelmInterface) {
        // set desired engine power
        if (from.enginePower < 0) {
            // ignore
        } else if (from.enginePower == this.ship.engine.power) {
            this.ship.engine.pendingPower = 0;
        } else {
            this.ship.engine.pendingPower =
                from.enginePower - this.ship.engine.power;
        }

        // set desired jump power
        if (from.jumpPower < 0) {
            // ignore
        } else if (from.jumpPower == this.ship.jumpEngine.power) {
            this.ship.jumpEngine.pendingPower = 0;
        } else {
            this.ship.jumpEngine.pendingPower =
                from.jumpPower - this.ship.jumpEngine.power;
        }

        // set desired thruster power
        if (from.thrusterPower < 0) {
            // ignore
        } else if (from.thrusterPower == this.ship.thrusters.power) {
            this.ship.thrusters.pendingPower = 0;
        } else {
            this.ship.thrusters.pendingPower =
                from.thrusterPower - this.ship.thrusters.power;
        }

        // if jump is pressed, do it
        // if evac is pressed, do it
        // if upgrade1 is pressed, do it
        // if upgrade2 is pressed, do it
        // if upgrade3 is pressed, do it

        // send the packet to the helm interfaces
        this.toInterface();

        // send the packet to the main view screen
        var mainViewScreen = this.ship.server.clients.find(
            c => c.id == 'mainViewScreen'
        );
        if (mainViewScreen) {
            var toMainViewScreen: ToMainViewScreen = {
                throttle: from.throttle * this.ship.engine.thrust,
                yaw: from.yaw * this.ship.thrusters.agility * 0.75,
                pitch: from.pitch * this.ship.thrusters.agility
            };
            global.logger.info(
                `to: ${mainViewScreen.id} - ${toMainViewScreen.yaw} x ${toMainViewScreen.pitch} @ ${toMainViewScreen.throttle}`
            );
            this.ship.server.tell(mainViewScreen, 'helm', toMainViewScreen);
        }
    }

    constructor(ship: Ship) {
        this._ship = ship;
    }
}
