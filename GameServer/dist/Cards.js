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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var es5ClassFix_1 = require("./es5ClassFix");
var Cards = /** @class */ (function (_super) {
    __extends(Cards, _super);
    function Cards() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // shuffle cards
    Cards.prototype.shuffle = function () {
        var _a;
        for (var i = this.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [this[j], this[i]], this[i] = _a[0], this[j] = _a[1];
        }
    };
    /** Call this before draw to ensure you will always get a card. */
    Cards.prototype.reshuffleIfEmpty = function (discards) {
        if (this.length > 0)
            return;
        global.logger.info("the library was empty, " + discards.length + " cards shuffled back into the library from the discard pile.");
        this.push.apply(this, discards);
        discards.length = 0;
        this.shuffle();
    };
    // draw the top card, removing it
    Cards.prototype.draw = function (discards, hand) {
        if (discards === void 0) { discards = undefined; }
        if (hand === void 0) { hand = undefined; }
        // reshuffle if a discards pile was provided
        if (discards)
            this.reshuffleIfEmpty(discards);
        // if a hand was provided, make sure it isn't full
        if (hand && hand.length >= 5) {
            global.logger.warn("draw could not be performed because the player's hand was full.");
            return;
        }
        // draw a card
        var card = this.pop();
        if (card == null) {
            global.logger.warn("draw could not be performed because there were no cards in the deck.");
            return;
        }
        global.logger.info("card \"" + card.id + " - " + card.title + "\" was drawn.");
        // if appropriate, add the card to the hand
        if (hand)
            hand.push(card);
        return card;
    };
    Cards = __decorate([
        es5ClassFix_1.es5ClassFix()
    ], Cards);
    return Cards;
}(Array));
exports.Cards = Cards;
