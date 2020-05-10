import { es5ClassFix } from './es5ClassFix';
import { Effect } from './Effect';
import { Tag } from './Tag';

@es5ClassFix()
export class Effects extends Array<Effect> {
    // add a simple numeric effect
    public add(
        title: string,
        key: string,
        value: string | number,
        lifetime: number = 0
    ) {
        var effect = new Effect(title);
        var tag = new Tag(key, value.toString());
        effect.tags.push(tag);
        if (lifetime > 0)
            effect.tags.push(new Tag('lifetime', lifetime.toString()));
        this.push(effect);
        return effect;
    }

    // sum all tags with a specific key across all upgrades
    public sum(key: string) {
        var total = 0;
        for (var effect of this) {
            for (var tag of effect.tags) {
                if (tag.key === key) total += Number(tag.value);
            }
        }
        return total;
    }

    // search all effects for the existance of a key
    public contains(key: string) {
        for (var effect of this) {
            if (effect.tags.contains(key)) return true;
        }
        return false;
    }

    // decrement and potentially remove
    public decrement(
        key: string,
        value: number,
        removeIfExpired: boolean = false
    ) {
        // loop in reverse so we can remove while iterating
        var i = this.length;
        while (i--) {
            const effect = this[i];
            const expired = effect.tags.decrement(key, value);
            if (expired && removeIfExpired) this.splice(i, 1);
        }
    }
}
