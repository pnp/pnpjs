import { TimelinePipe } from "@pnp/core";
import { Queryable } from "../queryable.js";

/**
 *
 * @param otherHeaders Optional list of additional headers to log from the response
 * @returns A timeline pipe
 */
export function DebugHeaders(otherHeaders: string[] = []): TimelinePipe {

    return (instance: Queryable) => {

        instance.on.parse.prepend(async function (this: Queryable, url, response, result) {

            // here we add logging for the request id and timestamp to assist in reporting issues to Microsoft
            const searchHeaders = ["request-id", "sprequestguid", "date", ...otherHeaders];

            for (let i = 0; i < searchHeaders.length; i++) {
                this.log(`${searchHeaders[i]}: ${response.headers.get(searchHeaders[i]) ?? ""}`);
            }

            return [url, response, result];
        });

        return instance;
    };
}
