// use of relative paths to the modules
import { Logger, LogLevel } from "@pnp/logging";
import { sp } from "@pnp/sp";

declare var process: { exit(code?: number): void };

export function Example() {

    // run some debugging
    sp.web.select("Title", "Description").get().then(w => {

        // logging results to the Logger
        Logger.log({
            data: w,
            level: LogLevel.Info,
            message: "Web's Title",
        });

        process.exit(0);
    });
}
