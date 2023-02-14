import { combine, dateAdd, isUrlAbsolute, TimelinePipe } from "@pnp/core";
import { BrowserFetchWithRetry, DefaultParse, Queryable } from "@pnp/queryable";
import { DefaultHeaders, DefaultInit } from "./defaults.js";
import { RequestDigest } from "./request-digest.js";

export interface ISPFXContext {

    pageContext: {
        web: {
            absoluteUrl: string;
        };
        legacyPageContext: {
            formDigestTimeoutSeconds: number;
            formDigestValue: string;
        };
    };

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
            // remove SPFx Token in default due to issues #2570, #2571
            // SPFxToken(context),
            RequestDigest((url) => {

                const sameWeb = (new RegExp(`^${combine(context.pageContext.web.absoluteUrl, "/_api")}`, "i")).test(url);
                if (sameWeb && context?.pageContext?.legacyPageContext?.formDigestValue) {

                    const creationDateFromDigest = new Date(context.pageContext.legacyPageContext.formDigestValue.split(",")[1]);

                    // account for page lifetime in timeout #2304 & others
                    // account for tab sleep #2550
                    return {
                        value: context.pageContext.legacyPageContext.formDigestValue,
                        expiration: dateAdd(creationDateFromDigest, "second", context.pageContext.legacyPageContext?.formDigestTimeoutSeconds - 15 || 1585),
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
