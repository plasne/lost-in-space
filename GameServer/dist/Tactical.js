"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Station_1 = require("./Station");
var FromTacticalInterface = /** @class */ (function () {
    function FromTacticalInterface() {
        this.battleStationsPower = 0;
        this.weaponChargePower = 0;
        this.shieldsPower = 0;
    }
    return FromTacticalInterface;
}());
exports.FromTacticalInterface = FromTacticalInterface;
var ToTacticalInterface = /** @class */ (function () {
    function ToTacticalInterface() {
        this.battleStationsPower = 0;
        this.battleStationsPendingPower = 0;
        this.weaponChargePower = 0;
        this.weaponChargePendingPower = 0;
        this.shieldsPower = 0;
        this.shieldsPendingPower = 0;
        this.targetSlot1 = '';
        this.targetSlot2 = '';
        this.targetSlot3 = '';
        this.targetSlot4 = '';
        this.targetSlot5 = '';
        this.maxShields = 0;
        this.foreShields = 0;
        this.aftShields = 0;
        this.portShields = 0;
        this.starShields = 0;
        this.reserve = 0;
        this.maxReserve = 0;
        this.card1 = 0;
        this.card2 = 0;
        this.card3 = 0;
        this.card4 = 0;
        this.card5 = 0;
    }
    return ToTacticalInterface;
}());
exports.ToTacticalInterface = ToTacticalInterface;
var Tactical = /** @class */ (function (_super) {
    __extends(Tactical, _super);
    function Tactical() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.battleStationsPower = 0;
        _this.battleStationsPendingPower = 0;
        _this.weaponChargePower = 0;
        _this.weaponChargePendingPower = 0;
        _this.shieldsPower = 0;
        _this.shieldsPendingPower = 0;
        return _this;
    }
    Object.defineProperty(Tactical.prototype, "prefix", {
        get: function () {
            return 'tactical';
        },
        enumerable: true,
        configurable: true
    });
    Tactical.prototype.getTargetSlot = function (index) {
        var slot = global.ship.scanners.slots[index];
        if (slot === null) {
            return 'no-target';
        }
        else if (slot === undefined) {
            return 'disabled';
        }
        else {
            var vessel = slot;
            if (vessel.stats)
                return slot.id + ',' + vessel.stats();
            return slot.id;
        }
    };
    Tactical.prototype.toInterface = function () {
        var clients = global.server.clients.filter(function (c) { return c.id != 'mainViewScreen'; });
        var toTacticalInterface = {
            battleStationsPower: global.ship.battleStations.power,
            battleStationsPendingPower: global.ship.battleStations.pendingPower,
            weaponChargePower: global.ship.weapons.power,
            weaponChargePendingPower: global.ship.weapons.pendingPower,
            shieldsPower: global.ship.shields.power,
            shieldsPendingPower: global.ship.shields.pendingPower,
            targetSlot1: this.getTargetSlot(0),
            targetSlot2: this.getTargetSlot(1),
            targetSlot3: this.getTargetSlot(2),
            targetSlot4: this.getTargetSlot(3),
            targetSlot5: this.getTargetSlot(4),
            maxShields: global.ship.shields.maxShields,
            foreShields: global.ship.shields.fore,
            aftShields: global.ship.shields.aft,
            portShields: global.ship.shields.port,
            starShields: global.ship.shields.starboard,
            reserve: global.ship.reactor.reserve,
            maxReserve: global.ship.reactor.maxReserve,
            card1: global.ship.battleStations.hand[0].id,
            card2: global.ship.battleStations.hand[1].id,
            card3: global.ship.battleStations.hand[2].id,
            card4: global.ship.battleStations.hand[3].id,
            card5: global.ship.battleStations.hand[4].id,
        };
        for (var _i = 0, clients_1 = clients; _i < clients_1.length; _i++) {
            var client = clients_1[_i];
            global.server.tell(client, 'tactical', toTacticalInterface);
        }
    };
    Tactical.prototype.fromInterface = function (from) {
        // set desired battlestations power
        if (from.battleStationsPower < 0) {
            // ignore
        }
        else if (from.battleStationsPower == global.ship.battleStations.power) {
            global.ship.battleStations.pendingPower = 0;
        }
        else {
            global.ship.battleStations.pendingPower =
                from.battleStationsPower - global.ship.battleStations.power;
        }
        // set desired weapon charge power
        if (from.weaponChargePower < 0) {
            // ignore
        }
        else if (from.weaponChargePower == global.ship.weapons.power) {
            global.ship.weapons.pendingPower = 0;
        }
        else {
            global.ship.weapons.pendingPower =
                from.weaponChargePower - global.ship.weapons.power;
        }
        // set desired shields power
        if (from.shieldsPower < 0) {
            // ignore
        }
        else if (from.shieldsPower == global.ship.shields.power) {
            global.ship.shields.pendingPower = 0;
        }
        else {
            global.ship.shields.pendingPower =
                from.shieldsPower - global.ship.shields.power;
        }
        // send the packet to the tactical interfaces
        this.toInterface();
    };
    Tactical.prototype.click = function (action) {
        // see if it is a card that was played
        var id = Number.parseInt(action);
        if (!isNaN(id)) {
            var card = global.ship.battleStations.getAvailableCardOfId(id);
            if (card && card.play) {
                card.isAvailable = false;
                eval("this." + card.play);
            }
            else {
                global.logger.warn("card " + id + " was not found as available in the operator's hand.");
            }
            return;
        }
        // see if it is an interface button
        switch (action) {
            case 'hold':
                global.logger.debug("battlestations put on-hold.");
                global.ship.battleStations.onHold = true;
                break;
            case 'unhold':
                global.logger.debug("battlestations released from on-hold.");
                global.ship.battleStations.onHold = false;
                break;
            default:
                _super.prototype.click.call(this, action);
                break;
        }
    };
    Tactical.prototype.fire = function (id) {
        var card = global.ship.battleStations.getEffect(id);
        if (card) {
            global.ship.weapons.enqueue(card);
        }
        else {
            global.logger.warn("effect " + id + " could not be found.");
        }
    };
    return Tactical;
}(Station_1.Station));
exports.Tactical = Tactical;
