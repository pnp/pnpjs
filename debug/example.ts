// use of relative paths to the modules
import { Logger, LogLevel } from "../packages/logging";
import { sp } from "../packages/sp";

export function Example() {

    // run some debugging
    sp.web.select("Title", "Description").get().then(w => {

        // logging results to the Logger
        Logger.log({
            data: w,
            level: LogLevel.Info,
            message: "Web's Title",
        });
    });
}
