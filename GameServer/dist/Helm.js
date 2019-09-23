"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FromHelmInterface = /** @class */ (function () {
    function FromHelmInterface() {
        this.throttle = 0.0;
        this.yaw = 0.0;
        this.pitch = 0.0;
        this.enginePower = 0;
        this.jumpPower = 0;
        this.thrusterPower = 0;
    }
    return FromHelmInterface;
}());
exports.FromHelmInterface = FromHelmInterface;
var ToHelmInterface = /** @class */ (function () {
    function ToHelmInterface() {
        this.enginePower = 0;
        this.enginePendingPower = 0;
        this.jumpPower = 0;
        this.jumpPendingPower = 0;
        this.thrusterPower = 0;
        this.thrusterPendingPower = 0;
        this.crew = 0;
        this.crewIsEvac = false;
        this.jumpIsAvailable = false;
        this.upgrade1IsAvailable = false;
        this.upgrade2IsAvailable = false;
        this.upgrade3IsAvailable = false;
        this.foreShields = 0;
        this.maxForeShields = 0;
        this.aftShields = 0;
        this.maxAftShields = 0;
        this.portShields = 0;
        this.maxPortShields = 0;
        this.starShields = 0;
        this.maxStarShields = 0;
        this.reserve = 0;
        this.maxReserve = 0;
    }
    return ToHelmInterface;
}());
exports.ToHelmInterface = ToHelmInterface;
var ToMainViewScreen = /** @class */ (function () {
    function ToMainViewScreen() {
        this.throttle = 0.0;
        this.yaw = 0.0;
        this.pitch = 0.0;
    }
    return ToMainViewScreen;
}());
exports.ToMainViewScreen = ToMainViewScreen;
var Helm = /** @class */ (function () {
    function Helm(ship) {
        this._ship = ship;
    }
    Object.defineProperty(Helm.prototype, "ship", {
        // reference to the ship
        get: function () {
            return this._ship;
        },
        enumerable: true,
        configurable: true
    });
    Helm.prototype.toInterface = function () {
        var clients = this.ship.server.clients.filter(function (c) { return c.id != 'mainViewScreen'; });
        var toHelmInterface = {
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
        for (var _i = 0, clients_1 = clients; _i < clients_1.length; _i++) {
            var client = clients_1[_i];
            this.ship.server.tell(client, 'helm', toHelmInterface);
        }
    };
    Helm.prototype.fromInterface = function (from) {
        // set desired engine power
        if (from.enginePower < 0) {
            // ignore
        }
        else if (from.enginePower == this.ship.engine.power) {
            this.ship.engine.pendingPower = 0;
        }
        else {
            this.ship.engine.pendingPower =
                from.enginePower - this.ship.engine.power;
        }
        // set desired jump power
        if (from.jumpPower < 0) {
            // ignore
        }
        else if (from.jumpPower == this.ship.jumpEngine.power) {
            this.ship.jumpEngine.pendingPower = 0;
        }
        else {
            this.ship.jumpEngine.pendingPower =
                from.jumpPower - this.ship.jumpEngine.power;
        }
        // set desired thruster power
        if (from.thrusterPower < 0) {
            // ignore
        }
        else if (from.thrusterPower == this.ship.thrusters.power) {
            this.ship.thrusters.pendingPower = 0;
        }
        else {
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
        var mainViewScreen = this.ship.server.clients.find(function (c) { return c.id == 'mainViewScreen'; });
        if (mainViewScreen) {
            var toMainViewScreen = {
                throttle: from.throttle * this.ship.engine.thrust,
                yaw: from.yaw * this.ship.thrusters.agility * 0.75,
                pitch: from.pitch * this.ship.thrusters.agility
            };
            global.logger.info("to: " + mainViewScreen.id + " - " + toMainViewScreen.yaw + " x " + toMainViewScreen.pitch + " @ " + toMainViewScreen.throttle);
            this.ship.server.tell(mainViewScreen, 'helm', toMainViewScreen);
        }
    };
    return Helm;
}());
exports.Helm = Helm;
