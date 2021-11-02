import { combine, isUrlAbsolute, TimelinePipe } from "@pnp/core";
import { BrowserFetchWithRetry, DefaultParse, Queryable } from "@pnp/queryable";
import { DefaultHeaders, DefaultInit } from "./defaults.js";

interface ISPFXContext {

    aadTokenProviderFactory?: {
        getTokenProvider(): Promise<{
            getToken(resource: string): Promise<string>;
        }>;
    };

    msGraphClientFactory?: {
        getClient: () => Promise<any>;
    };

    pageContext: {
        web: {
            absoluteUrl: string;
        };
    };
}

export function SPFx(context: ISPFXContext, graphBaseUrl = "https://graph.microsoft.com"): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.using(
            DefaultHeaders(),
            DefaultInit(),
            BrowserFetchWithRetry(),
            DefaultParse());

        // we want to fix up the url first
        instance.on.pre.prepend(async (url, init, result) => {

            if (!isUrlAbsolute(url)) {
                url = combine(graphBaseUrl, url);
            }

            return [url, init, result];
        });

        instance.on.auth.replace(async function (url: URL, init: RequestInit) {

            const provider = await context.aadTokenProviderFactory.getTokenProvider();
            const token = await provider.getToken(`${url.protocol}//${url.hostname}`);

            // eslint-disable-next-line @typescript-eslint/dot-notation
            init.headers["Authorization"] = `Bearer ${token}`;

            return [url, init];
        });

        return instance;
    };
}
