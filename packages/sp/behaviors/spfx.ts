import { combine, dateAdd, isUrlAbsolute, TimelinePipe } from "@pnp/core";
import { BrowserFetchWithRetry, DefaultParse, Queryable } from "@pnp/queryable";
import { DefaultHeaders, DefaultInit } from "./defaults.js";
import { RequestDigest } from "./request-digest.js";

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
        legacyPageContext: {
            formDigestTimeoutSeconds: number;
            formDigestValue: string;
        };
    };
}

export function SPFx(context: ISPFXContext): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.using(
            DefaultHeaders(),
            DefaultInit(),
            BrowserFetchWithRetry(),
            DefaultParse(),
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            RequestDigest(() => {

                if (context?.pageContext?.legacyPageContext) {

                    return {
                        value: context.pageContext.legacyPageContext.formDigestValue,
                        expiration: dateAdd(new Date(), "second", context.pageContext.legacyPageContext.formDigestTimeoutSeconds),
                    };
                }
            }));

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
