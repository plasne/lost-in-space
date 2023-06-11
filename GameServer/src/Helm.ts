import { Station } from './Station';

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
    public action1IsAvailable: boolean = false;
    public action2IsAvailable: boolean = false;
    public action3IsAvailable: boolean = false;
    public maxShields: number = 0;
    public foreShields: number = 0;
    public aftShields: number = 0;
    public portShields: number = 0;
    public starShields: number = 0;
    public reserve: number = 0;
    public maxReserve: number = 0;
}

export class ToMainViewScreen {
    public speed: number = 0.0;
    public yaw: number = 0.0;
    public pitch: number = 0.0;
}

export class Helm extends Station {
    public get prefix(): string {
        return 'helm';
    }

    public toInterface() {
        var clients = global.server.clients.filter(
            (c) => c.id != 'mainViewScreen'
        );
        var toHelmInterface: ToHelmInterface = {
            enginePower: global.ship.engine.power,
            enginePendingPower: global.ship.engine.pendingPower,
            jumpPower: global.ship.jumpEngine.power,
            jumpPendingPower: global.ship.jumpEngine.pendingPower,
            thrusterPower: global.ship.thrusters.power,
            thrusterPendingPower: global.ship.thrusters.pendingPower,
            crew: 100,
            crewIsEvac: true,
            jumpIsAvailable: false,
            action1IsAvailable: this.action1 ? this.action1.isAvailable : false,
            action2IsAvailable: this.action2 ? this.action2.isAvailable : false,
            action3IsAvailable: this.action3 ? this.action3.isAvailable : false,
            maxShields: global.ship.shields.maxShields,
            foreShields: global.ship.shields.fore,
            aftShields: global.ship.shields.aft,
            portShields: global.ship.shields.port,
            starShields: global.ship.shields.starboard,
            reserve: global.ship.reactor.reserve,
            maxReserve: global.ship.reactor.maxReserve,
        };
        for (var client of clients) {
            global.server.tell(client, 'helm', toHelmInterface);
        }
    }

    public fromInterface(from: FromHelmInterface) {
        // set desired engine power
        if (from.enginePower < 0) {
            // ignore
        } else if (from.enginePower == global.ship.engine.power) {
            global.ship.engine.pendingPower = 0;
        } else {
            global.ship.engine.pendingPower =
                from.enginePower - global.ship.engine.power;
        }

        // set desired jump power
        if (from.jumpPower < 0) {
            // ignore
        } else if (from.jumpPower == global.ship.jumpEngine.power) {
            global.ship.jumpEngine.pendingPower = 0;
        } else {
            global.ship.jumpEngine.pendingPower =
                from.jumpPower - global.ship.jumpEngine.power;
        }

        // set desired thruster power
        if (from.thrusterPower < 0) {
            // ignore
        } else if (from.thrusterPower == global.ship.thrusters.power) {
            global.ship.thrusters.pendingPower = 0;
        } else {
            global.ship.thrusters.pendingPower =
                from.thrusterPower - global.ship.thrusters.power;
        }

        // send the packet to the helm interfaces
        this.toInterface();

        // send the packet to the main view screen
        var mainViewScreen = global.server.clients.find(
            (c) => c.id == 'mainViewScreen'
        );
        if (mainViewScreen) {
            var toMainViewScreen: ToMainViewScreen = {
                speed: from.throttle * global.ship.thrust + global.ship.speed,
                yaw: from.yaw * global.ship.agility * 0.75,
                pitch: from.pitch * global.ship.agility,
            };
            global.logger.info(
                `to: ${mainViewScreen.id} - ${toMainViewScreen.yaw} x ${toMainViewScreen.pitch} @ ${toMainViewScreen.speed}`
            );
            global.server.tell(mainViewScreen, 'helm', toMainViewScreen);
        }
    }
}
