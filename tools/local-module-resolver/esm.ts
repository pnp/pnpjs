import { join, resolve as presolve, dirname } from "path";
import { existsSync } from "fs";
import findup from "findup-sync";

// give ourselves a single reference to the projectRoot
const projectRoot = presolve(dirname(findup("package.json")));
const isWin32 = process.platform === "win32";

function log(_message: string) {
    // console.log(`PnP Node Local Module Loader: ${message}`);
}

log("Loaded");
log(`process.platform: ${process.platform}`);

const cache = new Map<string, ResolvedValue>();

export function createResolve(innerPath: string): ResolverFunc {

    return async function (specifier: string, context: ResolveContext, defaultResolve: Function): Promise<ResolvedValue> {

        if (specifier.startsWith("@pnp")) {

            const modulePath = specifier.substring(4);

            if (cache.has(modulePath)) {
                return cache.get(modulePath);
            }

            let candidate = join(projectRoot, innerPath, modulePath);

            if (existsSync(candidate + ".js")) {

                candidate = candidate + ".js"

            } else {

                candidate = join(candidate, "index.js");
            }

            try {

                const url = new URL("file://" + candidate).href;

                log(`Resolved: ${specifier} => ${url}`);

                const resolved: ResolvedValue = {
                    url,
                    format: "module",
                };

                cache.set(modulePath, resolved);

                return resolved;

            } catch (e) {

                console.error(`Error in local module resolver candidate url: ${candidate}.`)
                console.error(e);
                throw e;
            }
        }

        if (specifier.indexOf("settings.js") > -1 && isWin32 && specifier.indexOf("file://") < 0) {
            specifier = "file://" + specifier;
            log(`patching settings.js import path for win32: ${specifier}`);
        }

        // Defer to Node.js for all other specifiers.
        return defaultResolve(specifier, context, defaultResolve);
    }
}

export interface ResolvedValue {
    url: string;
    format?: "module";
}

export interface ResolveContext {
    conditions?: [];
    parentUrl?: string | undefined;
}

export interface ResolverFunc {
    (specifier: string, context: ResolveContext, defaultResolve: Function): Promise<ResolvedValue>;
}
