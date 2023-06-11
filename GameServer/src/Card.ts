import { Tag } from './Tag';
import { Tags } from './Tags';

export class Card {
    public id: number = 0;
    public title: string | undefined;
    // costs
    // slots
    // picture
    // text
    public draw: string | undefined;
    public play: string | undefined;
    public tags: Tags = new Tags();
    // keywords
    public isAvailable: boolean = true;

    public static from(json: any): Card {
        let card = new Card();
        card.id = Number.parseInt(json.id);
        card.title = json.title;
        card.draw = json.draw;
        card.play = json.play;
        var tags: string[] = json.tags;
        for (let val of tags) {
            let stag = val.split(':');
            if (stag.length > 0) {
                let tag = new Tag(stag[0], stag[1]);
                card.tags.push(tag);
            } else {
                let tag = new Tag(val, '');
                card.tags.push(tag);
            }
        }
        return card;
    }

    public clone() {
        let card = new Card();
        card.id = this.id;
        card.title = this.title;
        card.draw = this.draw;
        card.play = this.play;
        card.tags = this.tags.clone();
        card.isAvailable = this.isAvailable;
        return card;
    }
}
