import { hOP } from "@pnp/core";
import { Logger, LogLevel } from "@pnp/logging";
import { extendGlobal } from "./invokable-extensions.js";
import { IQueryable } from "./queryable.js";

declare module "./queryable" {
    /**
     * Returns the instance wrapped by the invokable proxy
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface IQueryable<DefaultActionType = any> {
        __deepTrace: boolean;
        __enableDeepTrace(): void;
        __disableDeepTrace(): void;
        __json(): <T = any>(target: T) => () => any;
        __unwrap(): any;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        get: (target: IQueryable<any>, p: string | number | symbol, _receiver: any) => {
            switch (p) {
                case "__enableDeepTrace":
                    return () => {
                        target.__deepTrace = true;
                    };
                case "__disableDeepTrace":
                    return () => {
                        target.__deepTrace = false;
                    };
                case "__data":
                    return target.data;
                case "__unwrap":
                    return () => target;
                case "__json":
                    return () => {

                        const o: any = {};

                        for (const name in target) {
                            if (hOP(target, name)) {
                                o[name] = target[name];
                            }
                        }

                        return o;
                    };
            }
        },
    }]);
