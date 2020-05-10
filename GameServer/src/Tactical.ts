import { Station } from './Station';
import { Vessel } from './Vessel';

export class FromTacticalInterface {
    public battleStationsPower: number = 0;
    public weaponChargePower: number = 0;
    public shieldsPower: number = 0;
}

export class ToTacticalInterface {
    public battleStationsPower: number = 0;
    public battleStationsPendingPower: number = 0;
    public weaponChargePower: number = 0;
    public weaponChargePendingPower: number = 0;
    public shieldsPower: number = 0;
    public shieldsPendingPower: number = 0;
    public targetSlot1: string = '';
    public targetSlot2: string = '';
    public targetSlot3: string = '';
    public targetSlot4: string = '';
    public targetSlot5: string = '';
    public maxShields: number = 0;
    public foreShields: number = 0;
    public aftShields: number = 0;
    public portShields: number = 0;
    public starShields: number = 0;
    public reserve: number = 0;
    public maxReserve: number = 0;
    public card1: number = 0;
    public card2: number = 0;
    public card3: number = 0;
    public card4: number = 0;
    public card5: number = 0;
}

export class Tactical extends Station {
    public battleStationsPower: number = 0;
    public battleStationsPendingPower: number = 0;
    public weaponChargePower: number = 0;
    public weaponChargePendingPower: number = 0;
    public shieldsPower: number = 0;
    public shieldsPendingPower: number = 0;

    public get prefix(): string {
        return 'tactical';
    }

    private getTargetSlot(index: number) {
        const slot = global.ship.scanners.slots[index];
        if (slot === null) {
            return 'no-target';
        } else if (slot === undefined) {
            return 'disabled';
        } else {
            var vessel = slot as Vessel;
            if (vessel.stats) return slot.id + ',' + vessel.stats();
            return slot.id;
        }
    }

    public toInterface() {
        var clients = global.server.clients.filter(
            (c) => c.id != 'mainViewScreen'
        );

        var toTacticalInterface: ToTacticalInterface = {
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
        for (var client of clients) {
            global.server.tell(client, 'tactical', toTacticalInterface);
        }
    }

    public fromInterface(from: FromTacticalInterface) {
        // set desired battlestations power
        if (from.battleStationsPower < 0) {
            // ignore
        } else if (
            from.battleStationsPower == global.ship.battleStations.power
        ) {
            global.ship.battleStations.pendingPower = 0;
        } else {
            global.ship.battleStations.pendingPower =
                from.battleStationsPower - global.ship.battleStations.power;
        }

        // set desired weapon charge power
        if (from.weaponChargePower < 0) {
            // ignore
        } else if (from.weaponChargePower == global.ship.weapons.power) {
            global.ship.weapons.pendingPower = 0;
        } else {
            global.ship.weapons.pendingPower =
                from.weaponChargePower - global.ship.weapons.power;
        }

        // set desired shields power
        if (from.shieldsPower < 0) {
            // ignore
        } else if (from.shieldsPower == global.ship.shields.power) {
            global.ship.shields.pendingPower = 0;
        } else {
            global.ship.shields.pendingPower =
                from.shieldsPower - global.ship.shields.power;
        }

        // send the packet to the tactical interfaces
        this.toInterface();
    }

    public click(action: string) {
        // see if it is a card that was played
        var id = Number.parseInt(action);
        if (!isNaN(id)) {
            const card = global.ship.battleStations.getAvailableCardOfId(id);
            if (card && card.play) {
                card.isAvailable = false;
                eval(`this.${card.play}`);
            } else {
                global.logger.warn(
                    `card ${id} was not found as available in the operator's hand.`
                );
            }
            return;
        }

        // see if it is an interface button
        switch (action) {
            case 'hold':
                global.logger.debug(`battlestations put on-hold.`);
                global.ship.battleStations.onHold = true;
                break;
            case 'unhold':
                global.logger.debug(`battlestations released from on-hold.`);
                global.ship.battleStations.onHold = false;
                break;
            default:
                super.click(action);
                break;
        }
    }

    public fire(id: number) {
        var card = global.ship.battleStations.getEffect(id);
        if (card) {
            global.ship.weapons.enqueue(card);
        } else {
            global.logger.warn(`effect ${id} could not be found.`);
        }
    }
}
