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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var PoweredSystem_1 = require("./PoweredSystem");
var Card_1 = require("./Card");
var playerDeck = __importStar(require("../decks/player.json"));
var BattleStations = /** @class */ (function (_super) {
    __extends(BattleStations, _super);
    function BattleStations() {
        var _this = _super.call(this) || this;
        _this.library = [];
        _this.discards = [];
        _this.hand = [];
        console.log('here');
        // load the players deck
        for (var _i = 0, _a = playerDeck.sets[0].cards; _i < _a.length; _i++) {
            var json = _a[_i];
            var card = Card_1.Card.from(json);
            _this.library.push(card);
        }
        // deal a hand
        for (var i = 0; i < 5; i++) {
            _this.hand.push(_this.library[i]);
            global.logger.info(_this.library[i].title || 'no title');
        }
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
            return 18000 - this.power * 2;
        },
        enumerable: true,
        configurable: true
    });
    BattleStations.prototype.flip = function () { };
    BattleStations.prototype.tick = function () {
        _super.prototype.tick.call(this);
        // consume power, flip cards
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            this.flip();
            global.logger.debug("consumed " + this.power + " power to flip cards, leaving " + global.ship.reactor.reserve + " power in the reactor.");
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
