import { stringIsNullOrEmpty, TimelinePipe } from "@pnp/core";
import { Queryable2 } from "@pnp/queryable";
import { _SPQueryable } from "../sharepointqueryable.js";

const TagSymbol = Symbol.for("spTagging");

export function SPTagging(): TimelinePipe<Queryable2> {

    return (instance: Queryable2) => {

        instance.on.pre(async function (this: Queryable2 & { TagSymbol?: string }, url, init, result) {

            if (!init.headers["X-ClientService-ClientTag"] && !stringIsNullOrEmpty(this[TagSymbol])) {

                // TODO:: let clientTag = `PnPCoreJS:$$Version$$:${this[TagSymbol]}`;
                let clientTag = `PnPCoreJS:3.0.0-exp:${this[TagSymbol]}`;

                if (clientTag.length > 32) {
                    clientTag = clientTag.substr(0, 32);
                }

                init.headers["X-ClientService-ClientTag"] = clientTag;
            }

            return [url, init, result];
        });

        return instance;
    };
}

declare module "../sharepointqueryable" {
    interface ISPQueryable {
        tag(tag: string): this;
    }
    interface _SPQueryable {
        tag(tag: string): this;
    }
}

_SPQueryable.prototype.tag = function (this: _SPQueryable, tag: string) {
    this[TagSymbol] = tag;
    return this;
};
