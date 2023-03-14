import { TimelinePipe } from "@pnp/core";
import { BrowserFetchWithRetry, DefaultParse, Queryable } from "@pnp/queryable";
import { DefaultHeaders, DefaultInit } from "./defaults.js";

interface ISPFXContext {

    aadTokenProviderFactory?: {
        getTokenProvider(): Promise<{
            getToken(resource: string): Promise<string>;
        }>;
    };
}

export function SPFxToken(context: ISPFXContext): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

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

export function SPFx(context: ISPFXContext): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.using(
            DefaultHeaders(),
            DefaultInit(),
            BrowserFetchWithRetry(),
            DefaultParse(),
            SPFxToken(context));

        return instance;
    };
}
