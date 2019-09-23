import { Effect } from './Effect';
export declare class Effects extends Array<Effect> {
    add(title: string, key: string, value: number, lifetime?: number): void;
    sum(key: string): number;
    decrement(key: string, value: number, removeIfZero?: boolean): void;
}
interface Constructor<T> {
    new (...args: any[]): T;
}
export declare function es5ClassFix(): (target: Constructor<any>) => any;
export {};
