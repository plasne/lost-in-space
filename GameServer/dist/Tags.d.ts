import { Tag } from './Tag';
export declare class Tags extends Array<Tag> {
    contains(key: string): boolean;
    decrement(key: string, value: number): boolean;
    clone(): Tags;
}
