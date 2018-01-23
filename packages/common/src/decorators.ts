import { Logger, LogLevel } from "@pnp/logging";

export function deprecated(deprecationVersion: string, message: string) {

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
