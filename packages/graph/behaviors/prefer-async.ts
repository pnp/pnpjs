import { TimelinePipe } from "@pnp/core";
import { InjectHeaders } from "@pnp/queryable";
import { GraphQueryable, _GraphQueryable, graphGet } from "../graphqueryable";
import { RichLongRunningOperation } from "@microsoft/microsoft-graph-types";

export function PreferAsync(pollIntervalMs: number = 25000, maxPolls: number = 4): TimelinePipe {
    return (instance: _GraphQueryable) => {
        instance.using(InjectHeaders({ "Prefer": "respond-async" }));

        instance.on.parse(async function (url, response, result) {
            if (response.status === 202) {
                const opLocation = response.headers.get("Location");
                const opId = opLocation.split("/").at(-1);

                let succeeded = false;
                const statusQuery = GraphQueryable(instance, `operations/${opId}`);
                for (let i = 0; i < maxPolls; i++) {
                    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));

                    const status = await graphGet<RichLongRunningOperation>(statusQuery);
                    if (status.status === 'succeeded') {
                        let resultEndpoint = status.resourceLocation.split("/").at(-1);
                        result = await graphGet(GraphQueryable(instance, resultEndpoint));
                        succeeded = true;
                        break;
                    } else if (status.status === 'failed') {
                        throw status.error;
                    }
                }
                if (!succeeded) {
                    throw new Error(`Timed out waiting for async operation after ${pollIntervalMs * maxPolls}ms`);
                }
            }
            return [url, response, result];
        })

        return instance;
    }
}