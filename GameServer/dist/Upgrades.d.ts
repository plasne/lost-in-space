import { Upgrade } from './Upgrade';
export declare class Upgrades extends Array<Upgrade> {
    sum(key: string): number;
}
interface Constructor<T> {
    new (...args: any[]): T;
}
export declare function es5ClassFix(): (target: Constructor<any>) => any;
export {};
