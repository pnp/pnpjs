import { TimelinePipe } from "@pnp/core";
import { Queryable } from "@pnp/queryable";

export function Endpoint(endpoint: "beta" | "v1.0"): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async function (this: Queryable, url, init, result) {

            const all = ["beta", "v1.0"];
            let regex = new RegExp(endpoint, "i");
            const replaces = all.filter(s => !regex.test(s)).map(s => s.replace(".", "\\."));
            regex = new RegExp(`/?(${replaces.join("|")})/?`, "ig");
            url = url.replace(regex, `/${endpoint}/`);

            return [url, init, result];
        });

        return instance;
    };
}

