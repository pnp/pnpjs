import "./queryable";
import { hook } from "./hooking";
import { Logger, LogLevel } from "@pnp/logging";

declare module "./queryable" {
    /**
     * Returns the instance wrapped by the invokable proxy
     */
    interface IQueryable<DefaultActionType> {
        __enableDeepTrace(): void;
        __json(): <T = any>(target: T) => () => any;
    }

    interface Queryable<DefaultActionType> {
        __enableDeepTrace(): void;
        __json(): <T = any>(target: T) => () => any;
    }
}

let deepTrace = false;

hook([
    (op: string, _target: any, ...rest: any[]): void => {
        if (deepTrace) {
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
        get: (target, p: string | number | symbol, _receiver: any) => {
            switch (p) {
                case "__enableDeepTrace":
                    return () => { deepTrace = true; };
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
