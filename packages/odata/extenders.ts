export function addProp<T, U>(target: { prototype: any }, name: string, factory: (arg: U, p?: string) => T, path?: string): void {

    Reflect.defineProperty(target.prototype, name, {
        configurable: true,
        enumerable: true,
        get: function (this: U) {
            return factory(this, path);
        },
    });
}
