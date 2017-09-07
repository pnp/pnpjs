// use of relative paths to the modules
import pnp from "../src/pnp";
import { Logger, LogLevel } from "../src/utils/logging";

export function Example() {

    // run some debugging
    pnp.sp.web.select("Title", "Description").get().then(w => {

        // logging results to the Logger
        Logger.log({
            data: w,
            message: "Web's Title",
            level: LogLevel.Verbose
        });
    });
}
