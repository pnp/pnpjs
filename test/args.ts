import { LogLevel } from "@pnp/logging";

export function getProcessArgs(): IProcessArgs {

    // we need to load up the appropriate settings based on where we are running
    let mode: "cmd" | "online" | "online-noweb" = "cmd";
    let site: string = null;
    let skipWeb = false;
    let deleteWeb = false;
    let logging = LogLevel.Off;
    let deleteAllWebs = false;
    let record = false;
    let recordMode: "read" | "write" = "read";

    for (let i = 0; i < process.argv.length; i++) {
        const arg = process.argv[i];
        if (/^--mode/i.test(arg)) {
            switch (process.argv[++i]) {
                case "pr":
                    mode = "online-noweb";
                    break;
                case "push":
                    mode = "online";
            }
        }
        if (/^--site/i.test(arg)) {
            site = process.argv[++i];
        }
        if (/^--skip-web/i.test(arg)) {
            skipWeb = true;
        }
        if (/^--cleanup/i.test(arg)) {
            deleteWeb = true;
        }
        if (/^--deleteAllWebs/i.test(arg)) {
            deleteAllWebs = true;
        }
        if (/^--logging/i.test(arg)) {

            if (/Verbose|Info|Warning|Error/i.test(process.argv[i + 1])) {

                switch (process.argv[++i].toLowerCase()) {
                    case "verbose":
                        logging = LogLevel.Verbose;
                        break;
                    case "info":
                        logging = LogLevel.Info;
                        break;
                    case "warning":
                        logging = LogLevel.Warning;
                        break;
                    case "error":
                        logging = LogLevel.Error;
                        break;
                }

            } else {
                logging = LogLevel.Info;
            }
        }
        if (/^--record/i.test(arg)) {

            record = true;

            if (/write/i.test(process.argv[i + 1])) {

                switch (process.argv[++i].toLowerCase()) {
                    case "write":
                        recordMode = "write";
                        break;
                }
            }
        }
    }

    const processArgs = {
        mode,
        site,
        skipWeb,
        deleteWeb,
        logging,
        deleteAllWebs,
        record,
        recordMode,
    };

    console.log("*****************************");
    console.log("Testing command args:");
    const keys = Object.keys(processArgs);
    for (let i = 0; i < keys.length; i++) {
        console.log(`${keys[i]}: ${processArgs[keys[i]]}`);
    }
    console.log("*****************************");

    return processArgs;
}

export interface IProcessArgs {
    mode: "cmd" | "online" | "online-noweb";
    site: string | null;
    skipWeb: boolean;
    deleteWeb: boolean;
    logging: LogLevel;
    deleteAllWebs: boolean;
    record: boolean;
    recordMode: "read" | "write";
}
