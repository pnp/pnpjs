import { LogLevel, Logger } from "@pnp/logging";

export function deprecatedClass(deprecationVersion: string, message: string) {

    return (target: any): void => {
        Logger.log({
            data: {
                target: target,
            },
            level: LogLevel.Warning,
            message: `(${deprecationVersion}) ${message}`,
        });
    };
}

export function deprecated(deprecationVersion: string, message: string) {

    return (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {

        const method = descriptor.value;

        descriptor.value = function (this: any, ...args: any[]) {
            Logger.log({
                data: {
                    descriptor: descriptor,
                    propertyKey: propertyKey,
                    target: target,
                },
                level: LogLevel.Warning,
                message: `(${deprecationVersion}) ${message}`,
            });

            return method.apply(this, args);
        };
    };
}

export function beta(message = "This feature is flagged as beta and is subject to change.") {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const method = descriptor.value;

        descriptor.value = function (this: any, ...args: any[]) {
            Logger.log({
                data: {
                    descriptor: descriptor,
                    propertyKey: propertyKey,
                    target: target,
                },
                level: LogLevel.Warning,
                message: message,
            });

            return method.apply(this, args);
        };
    };
}
