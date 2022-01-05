import { combine, dateAdd, hOP, objectDefinedNotNull, TimelinePipe } from "@pnp/core";
import { Queryable } from "@pnp/queryable";
import { extractWebUrl } from "../utils/extract-web-url.js";

interface IDigestInfo {
    expiration: Date;
    value: string;
}

// allows for the caching of digests across all calls which each have their own IDigestInfo wrapper.
const digests = new Map<string, IDigestInfo>();

export function RequestDigest(hook?: (url: string, init: RequestInit) => IDigestInfo | null | undefined): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.auth(async (url, init) => {

            // eslint-disable-next-line @typescript-eslint/dot-notation
            if (/get/i.test(init.method) && init.headers && !hOP(init.headers, "X-RequestDigest") && !hOP(init.headers, "Authorization")) {
                return [url, init];
            }

            const urlAsString = url.toString();
            const webUrl = extractWebUrl(urlAsString);

            // do we have one in the cache that is still valid
            let digest: IDigestInfo = digests.get(webUrl);
            if (digest !== undefined) {

                const now = new Date();
                if (now > digest.expiration) {
                    digest = null;
                }
            }

            if (!objectDefinedNotNull(digest) && typeof hook === "function") {
                // we assume anything we get from the hook is not already expired
                digest = hook(urlAsString, init);
            }

            // TODO:: do we want to include this? very few things run on classic pages to its wasted space and maybe wasted time.
            // if (!objectDefinedNotNull(digest)) {
            //     // we can try and grab it from the input on classic pages
            //     const input = <HTMLInputElement>document.getElementById("__REQUESTDIGEST");
            //     if (objectDefinedNotNull(input)) {
            //         digest = {
            //             value: input.value,
            //             expiration: dateAdd(new Date(), "second", 1800),
            //         };
            //     }
            // }

            if (!objectDefinedNotNull(digest)) {

                await fetch(combine(webUrl, "/_api/contextinfo"), {
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json;odata=verbose;charset=utf-8",
                    },
                    method: "POST",
                }).then(r => r.json()).then(p => {

                    digest = {
                        expiration: dateAdd(new Date(), "second", p.FormDigestTimeoutSeconds),
                        value: p.FormDigestValue,
                    };
                });
            }

            if (objectDefinedNotNull(digest)) {

                init.headers = {
                    "X-RequestDigest": digest.value,
                    ...init.headers,
                };

                digests.set(webUrl, digest);
            }

            return [url, init];
        });

        return instance;
    };
}
