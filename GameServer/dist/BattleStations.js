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
var PoweredSystem_1 = require("./PoweredSystem");
var Card_1 = require("./Card");
var Cards_1 = require("./Cards");
var fs = require('fs');
var BattleStations = /** @class */ (function (_super) {
    __extends(BattleStations, _super);
    function BattleStations() {
        var _this = _super.call(this) || this;
        _this.flipIndex = 0;
        _this.flipAccumulation = 0;
        _this.effectivePower = 0;
        _this.onHold = false;
        _this.library = new Cards_1.Cards();
        _this.discards = new Cards_1.Cards();
        _this.hand = new Cards_1.Cards();
        _this.effects = new Cards_1.Cards();
        // create a filler deck in case it takes a while to load
        _this.hand.push(new Card_1.Card());
        _this.hand.push(new Card_1.Card());
        _this.hand.push(new Card_1.Card());
        _this.hand.push(new Card_1.Card());
        _this.hand.push(new Card_1.Card());
        // load the players deck
        fs.readFile('./decks/player.json', function (err, raw) {
            if (!err) {
                var deck = JSON.parse(raw);
                // add each card to the library or effects
                for (var _i = 0, _a = deck.sets[0].cards; _i < _a.length; _i++) {
                    var json = _a[_i];
                    var card = Card_1.Card.from(json);
                    if (card.tags.contains('effect')) {
                        _this.effects.push(card);
                    }
                    else {
                        _this.library.push(card);
                    }
                }
                // shuffle the library
                _this.library.shuffle();
                // deal a hand
                for (var i = 0; i < 5; i++) {
                    var card = _this.library.draw(_this.discards);
                    _this.hand[i] = card;
                }
                // start the flipping of cards
                setTimeout(function () {
                    _this.flip();
                }, 1000);
            }
            else {
                global.logger.error(err);
            }
        });
        return _this;
    }
    Object.defineProperty(BattleStations.prototype, "prefix", {
        get: function () {
            return 'battle';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BattleStations.prototype, "interval", {
        get: function () {
            return 18000 - this.effectivePower * 2000;
        },
        enumerable: true,
        configurable: true
    });
    BattleStations.prototype.flip = function () {
        var _this = this;
        // flip a card only if we are not on hold
        if (!this.onHold) {
            // increment
            this.flipAccumulation += 1000;
            // if time, draw a new card
            if (this.flipAccumulation >= this.interval) {
                this.flipAccumulation = 0;
                var newCard = this.library.draw(this.discards);
                if (newCard) {
                    var oldCard = this.hand[this.flipIndex];
                    this.hand[this.flipIndex] = newCard;
                    oldCard.isAvailable = true;
                    this.discards.push(oldCard);
                    this.flipIndex++;
                    if (this.flipIndex > 4)
                        this.flipIndex = 0;
                }
            }
        }
        // do it again in a bit
        setTimeout(function () {
            _this.flip();
        }, 1000);
    };
    BattleStations.prototype.getAvailableCardOfId = function (id) {
        var card = this.hand.find(function (c) { return c.id === id && c.isAvailable; });
        return card;
    };
    BattleStations.prototype.getEffect = function (id) {
        var card = this.effects.find(function (c) { return c.id === id; });
        return card;
    };
    BattleStations.prototype.tick = function () {
        _super.prototype.tick.call(this);
        // consume power, flip cards
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            this.effectivePower = this.power;
            global.logger.debug("consumed " + this.power + " power to make the flip card interval " + this.interval + " ms, leaving " + global.ship.reactor.reserve + " power in the reactor.");
        }
        else {
            // hard shutdown the jump engine
            this.power = 0;
            this.pendingPower = 0;
            global.logger.debug("the battle stations were shutdown because there was not enough reserve power in the reactor.");
        }
    };
    return BattleStations;
}(PoweredSystem_1.PoweredSystem));
exports.BattleStations = BattleStations;
