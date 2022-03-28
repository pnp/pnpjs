import { combine, dateAdd, hOP, objectDefinedNotNull, TimelinePipe } from "@pnp/core";
import { Queryable } from "@pnp/queryable";
import { extractWebUrl } from "../utils/extract-web-url.js";

interface IDigestInfo {
    expiration: Date;
    value: string;
}

function clearExpired(digest: IDigestInfo | null | undefined): IDigestInfo | null {
    const now = new Date();
    return !objectDefinedNotNull(digest) || (now > digest.expiration) ? null : digest;
}

// allows for the caching of digests across all calls which each have their own IDigestInfo wrapper.
const digests = new Map<string, IDigestInfo>();

export function RequestDigest(hook?: (url: string, init: RequestInit) => IDigestInfo | null | undefined): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async function (url, init, result) {

            // eslint-disable-next-line @typescript-eslint/dot-notation
            if (/get/i.test(init.method) || (init.headers && (hOP(init.headers, "X-RequestDigest") || hOP(init.headers, "Authorization")))) {
                return [url, init, result];
            }

            // add the request to the auth moment of the timeline
            this.on.auth(async (url, init) => {

                const urlAsString = url.toString();
                const webUrl = extractWebUrl(urlAsString);

                // do we have one in the cache that is still valid
                // from #2186 we need to always ensure the digest we get isn't expired
                let digest: IDigestInfo = clearExpired(digests.get(webUrl));

                if (!objectDefinedNotNull(digest) && typeof hook === "function") {
                    digest = clearExpired(hook(urlAsString, init));
                }

                if (!objectDefinedNotNull(digest)) {

                    // let's get one from the server
                    digest = await fetch(combine(webUrl, "/_api/contextinfo"), {
                        cache: "no-cache",
                        credentials: "same-origin",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json;odata=verbose;charset=utf-8",
                        },
                        method: "POST",
                    }).then(r => r.json()).then(p => ({
                        expiration: dateAdd(new Date(), "second", p.FormDigestTimeoutSeconds),
                        value: p.FormDigestValue,
                    }));
                }

                if (objectDefinedNotNull(digest)) {

                    // if we got a digest, set it in the headers
                    init.headers = {
                        "X-RequestDigest": digest.value,
                        ...init.headers,
                    };

                    // and cache it for future requests
                    digests.set(webUrl, digest);
                }

                return [url, init];
            });

            return [url, init, result];
        });

        return instance;
    };
}
