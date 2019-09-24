import { Effect } from './Effect';
import { Tag } from './Tag';

@es5ClassFix()
export class Effects extends Array<Effect> {
    // add a simple effect
    public add(
        title: string,
        key: string,
        value: number,
        lifetime: number = 0
    ) {
        var effect = new Effect(title);
        effect.tags.push(new Tag(key, value));
        if (lifetime > 0) effect.tags.push(new Tag('lifetime', lifetime));
        this.push(effect);
        return effect;
    }

    // sum all tags with a specific key across all upgrades
    public sum(key: string) {
        var total = 0;
        for (var effect of this) {
            for (var tag of effect.tags) {
                if (tag.key === key) total += tag.value;
            }
        }
        return total;
    }

    // search all effects for the existance of a key
    public contains(key: string) {
        for (var effect of this) {
            for (var tag of effect.tags) {
                if (tag.key === key) return true;
            }
        }
        return false;
    }

    // decrement and potentially remove
    public decrement(
        key: string,
        value: number,
        removeIfZero: boolean = false
    ) {
        // loop in reverse so we can remove while iterating
        var i = this.length;
        while (i--) {
            var effect = this[i];
            for (var tag of effect.tags) {
                if (tag.key === key) {
                    tag.value -= value;
                    if (removeIfZero && tag.value <= 0) this.splice(i, 1);
                }
            }
        }
    }
}

// from: https://github.com/Microsoft/TypeScript/issues/13720
// NOTE: that I had to remove the constructor args

interface Constructor<T> {
    new (...args: any[]): T;
}

export function es5ClassFix(): (target: Constructor<any>) => any {
    return (target: Constructor<any>) => {
        return class extends target {
            constructor() {
                super();
                Object.setPrototypeOf(this, target.prototype);
            }
        };
    };
}
