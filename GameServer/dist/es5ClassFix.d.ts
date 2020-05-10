interface Constructor<T> {
    new (...args: any[]): T;
}
export declare function es5ClassFix(): (target: Constructor<any>) => any;
export {};
