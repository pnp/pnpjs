import { Logger, LogLevel } from "@pnp/logging";
import { sp } from "@pnp/sp";
import { SPFetchClient, SPOAuthEnv } from "@pnp/nodejs";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

    // configure your node options
    sp.setup({
        sp: {
            fetchClientFactory: () => {
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
