import { Effect } from './Effect';
export declare class Effects extends Array<Effect> {
    add(title: string, key: string, value: string | number, lifetime?: number): Effect;
    sum(key: string): number;
    contains(key: string): boolean;
    decrement(key: string, value: number, removeIfExpired?: boolean): void;
}
