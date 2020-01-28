import { Logger, LogLevel } from "@pnp/logging";
import { extendGlobal } from "./invokable-extensions";
import { IQueryable } from "./queryable";

declare module "./queryable" {
    /**
     * Returns the instance wrapped by the invokable proxy
     */
    interface IQueryable<DefaultActionType = any> {
        __deepTrace: boolean;
        __enableDeepTrace(): void;
        __disableDeepTrace(): void;
        __json(): <T = any>(target: T) => () => any;
        __unwrap(): any;
    }

    interface Queryable<DefaultActionType = any> {
        __deepTrace: boolean;
        __enableDeepTrace(): void;
        __disableDeepTrace(): void;
        __json(): <T = any>(target: T) => () => any;
        __unwrap(): any;
    }
}

extendGlobal([
    (op: string, target: IQueryable<any>, ...rest: any[]): void => {
        if (target.__deepTrace) {
            switch (op) {
                case "apply":
                    Logger.write(`${op} ::> ()`, LogLevel.Info);
                    break;
                case "has":
                case "get":
                case "set":
                    Logger.write(`${op} ::> ${rest[0]}`, LogLevel.Info);
                    break;
            }
        }
    },
    {
        get: (target: IQueryable<any>, p: string | number | symbol, _receiver: any) => {
            switch (p) {
                case "__enableDeepTrace":
                    return () => { target.__deepTrace = true; };
                case "__disableDeepTrace":
                    return () => { target.__deepTrace = false; };
                case "__data":
                    return target.data;
                case "__unwrap":
                    return () => target;
                case "__json":
                    return () => {

                        const o: any = {};

                        for (const name in target) {
                            if (target.hasOwnProperty(name)) {
                                o[name] = target[name];
                            }
                        }

                        return o;
                    };
            }
        },
    }]);
