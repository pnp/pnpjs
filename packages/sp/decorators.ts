/**
 * Decorator used to specify the default path for SPQueryable objects
 *
 * @param path
 */
export function defaultPath(path: string) {

    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            constructor(...args: any[]) {
                super(args[0], args.length > 1 && args[1] !== undefined ? args[1] : path);
            }
        };
    };
}

