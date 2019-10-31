/**
 * Class Decorators
 */

/**
 * Decorator used to specify the default path for SharePointQueryable objects
 * 
 * @param path 
 */
export function defaultPath(path: string) {

    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            constructor(...args: any[]) {
                super(args[0], args.length > 1 && args[1] !== undefined ? args[1] : path);
            }
        };
    };
}

 // TODO::?
// performance tracking method decorator
// redirect to graph api




