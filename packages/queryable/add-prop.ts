/**
 * Adds a property to a target instance
 *
 * @param target The object to whose prototype we will add a property
 * @param name Property name
 * @param factory Factory method used to produce the property value
 * @param path Any additional path required to produce the value
 */
export function addProp<T, U>(target: { prototype: any }, name: string, factory: (arg: U, p?: string) => T, path?: string): void {

    Reflect.defineProperty(target.prototype, name, {
        configurable: true,
        enumerable: true,
        get: function (this: U): T {
            return factory(this, path || name);
        },
    });
}
