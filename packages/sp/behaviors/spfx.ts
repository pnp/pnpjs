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

export function SPFx(context: ISPFXContext): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.using(
            DefaultHeaders(),
            DefaultInit(),
            BrowserFetchWithRetry(),
            DefaultParse());

        // we want to fix up the url first
        instance.on.pre.prepend(async (url, init, result) => {

            if (!isUrlAbsolute(url)) {
                url = combine(context.pageContext.web.absoluteUrl, url);
            }

            return [url, init, result];
        });

        return instance;
    };
}
