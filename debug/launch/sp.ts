import { Logger, LogLevel } from "@pnp/logging";
import { sp } from "@pnp/sp";
import { SPFetchClient, SPOAuthEnv /*, setProxyUrl*/ } from "@pnp/nodejs";

declare var process: { env: any, exit(code?: number): void };

export async function Example(settings: any) {

    // configure your node options
    sp.setup({
        sp: {
            fetchClientFactory: () => {
                // UNSAFE - USE NODE_TLS_REJECT_UNAUTHORIZED FOR TESTING ONLY
                // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

                // you can set a proxy to examine traffic or for use in a corp environment
                // this example users fiddler
                // setProxyUrl("http://127.0.0.1:8888");

                return new SPFetchClient(settings.testing.sp.url, settings.testing.sp.id, settings.testing.sp.secret, SPOAuthEnv.SPO);
            },
        },
    });

    // run some debugging
    sp.web.select("Title", "Description").get().then(w => {

        // logging results to the Logger
        Logger.log({
            data: w,
            level: LogLevel.Info,
            message: "Web's Title",
        });

        process.exit(0);
    }).catch(e => {

        Logger.error(e);
        process.exit(1);
    });
}
