// from: https://github.com/Microsoft/TypeScript/issues/13720
// NOTE: that I had to remove the constructor args

interface Constructor<T>
{
    new(...args: any[]): T;
}

export function es5ClassFix() : (target: Constructor<any>) => any {
    return (target: Constructor<any>) => {
        return class extends target {
            constructor()
{
    super();
    Object.setPrototypeOf(this, target.prototype);
}
        };
    };
}
