"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tag_1 = require("./Tag");
var Card = /** @class */ (function () {
    function Card() {
        this.id = 0;
        this.tags = [];
    }
    // keywords
    Card.from = function (json) {
        var card = new Card();
        card.id = json.id;
        card.title = json.title;
        card.draw = json.draw;
        card.play = json.play;
        var tags = json.tags;
        for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
            var val = tags_1[_i];
            var stag = val.split(':');
            if (stag.length > 0) {
                var tag = new Tag_1.Tag(stag[0], stag[1]);
                card.tags.push(tag);
            }
            else {
                var tag = new Tag_1.Tag(val, '');
                card.tags.push(tag);
            }
        }
        return card;
    };
    return Card;
}());
exports.Card = Card;
