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
}

export function SPFx(context: ISPFXContext): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.using(
            DefaultHeaders(),
            DefaultInit(),
            BrowserFetchWithRetry(),
            DefaultParse(),
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
