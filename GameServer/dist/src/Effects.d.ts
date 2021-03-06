import { Effect } from './Effect';
export declare class Effects extends Array<Effect> {
    add(title: string, key: string, value: string | number, lifetime?: number): Effect;
    sum(key: string): number;
    contains(key: string): boolean;
    decrement(key: string, value: number, removeIfZero?: boolean): void;
}
interface Constructor<T> {
    new (...args: any[]): T;
}
export declare function es5ClassFix(): (target: Constructor<any>) => any;
export {};
