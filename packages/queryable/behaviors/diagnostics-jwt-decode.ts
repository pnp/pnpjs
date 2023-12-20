import { stringIsNullOrEmpty } from "@pnp/core";
import { Queryable } from "../queryable";

export function Diagnostics_JWTDecoder() {

    return (instance: Queryable) => {

        instance.on.auth(async function (url: URL, init: RequestInit) {

            // eslint-disable-next-line @typescript-eslint/dot-notation
            if (!stringIsNullOrEmpty(init.headers["Authorization"])) {

                // eslint-disable-next-line @typescript-eslint/dot-notation
                const parts = (<string>init.headers["Authorization"]).split(".");

                this.log(JSON.stringify(JSON.parse(atob(parts[1])), null, 2), 1);
            }

            return [url, init];
        });

        return instance;
    };
}
