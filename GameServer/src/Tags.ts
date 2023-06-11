import { Tag } from './Tag';

export class Tags extends Array<Tag> {
    // search all tags for the existance of a key
    public contains(key: string) {
        for (var tag of this) {
            if (tag.key === key) return true;
        }
        return false;
    }

    // decrement, returns true if the tag was found and <= 0
    public decrement(key: string, value: number) {
        var tag = this.find((t) => t.key === key);
        if (tag == undefined) return false;
        var numval = Number(tag.value);
        numval -= value;
        tag.value = numval.toString();
        return numval <= 0;
    }

    public clone() {
        const tags = new Tags();
        for (var tag of this) {
            tags.push(new Tag(tag.key, tag.value));
        }
        return tags;
    }
}
