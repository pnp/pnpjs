import { TimelinePipe, delay } from "@pnp/core";
import { errorCheck, InjectHeaders } from "@pnp/queryable";
import { GraphQueryable, _GraphQueryable, graphGet } from "../graphqueryable.js";
import { RichLongRunningOperation } from "@microsoft/microsoft-graph-types";

export function PreferAsync(pollIntervalMs: number = 25000, maxPolls: number = 4): TimelinePipe {
    return (instance: _GraphQueryable) => {
        instance.using(InjectHeaders({ "Prefer": "respond-async" }));
        instance.on.parse(errorCheck);
        instance.on.parse(async function (url: URL, response: Response, result: any) {
            if (response.status === 202) {
                const opLocation = response.headers.get("Location");
                const opId = opLocation.split("/").at(-1);

                const statusQuery = GraphQueryable(instance, `operations/${opId}`);
                for (let i = 0; i < maxPolls; i++) {
                    await delay(pollIntervalMs);

                    const status = await statusQuery<RichLongRunningOperation>();
                    if (status.status === 'succeeded') {
                        let resultEndpoint = status.resourceLocation.split("/").at(-1);
                        result = await graphGet(GraphQueryable(instance, resultEndpoint));
                    } else if (status.status === 'failed') {
                        throw status.error;
                    }
                }
                throw new Error(`Timed out waiting for async operation after ${pollIntervalMs * maxPolls}ms`);
            }

            return [url, response, result];
        });

        return instance;
    }
}