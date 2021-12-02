import { LogLevel, _subscribers } from "../logger.js";

export function PnPLogging<T>(activeLevel: LogLevel): (o: T) => T {

    return (instance: T) => {

        (<any>instance).on.log(function (message: string, level: LogLevel) {

            if (activeLevel <= level) {
                _subscribers.map(subscriber => subscriber.log({ level, message }));
            }
        });

        return instance;
    };
}
