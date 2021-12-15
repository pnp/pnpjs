import { join, resolve as presolve, dirname } from "path";
import { existsSync } from "fs";
import findup from "findup-sync";

// give ourselves a single reference to the projectRoot
const projectRoot = presolve(dirname(findup("package.json")));
const isWin32 = process.platform === "win32";

function log(_message: string) {
    // console.log(`PnP Debug Loader: ${message}`);
}

log("Loaded");
log(`process.platform: ${process.platform}`);

const cache = new Map<string, ResolvedValue>();

interface ResolvedValue {
    url: string,
    format?: "module"
}

interface ResolveContext {
    conditions?: [];
    parentUrl?: string | undefined;
}

export async function resolve(specifier: string, context: ResolveContext, defaultResolve: Function): Promise<ResolvedValue> {

    if (specifier.startsWith("@pnp")) {

        const modulePath = specifier.substring(4);

        if (cache.has(modulePath)) {
            return cache.get(modulePath);
        }

        let candidate = join(projectRoot, "/build/testing/packages", modulePath);

        if (existsSync(candidate + ".js")) {

            candidate = candidate + ".js"

        } else {

            candidate = join(candidate, "index.js");
        }

        if (isWin32) {
            candidate = "file://" + candidate;
        }

        const url = new URL(candidate).href;

        log(`Resolved: ${specifier} => ${url}`);

        const resolved: ResolvedValue = {
            url,
            format: "module",
        };

        cache.set(modulePath, resolved);

        return resolved;
    }

    if (/^[a-z]:[\\|/]/i.test(specifier) && isWin32) {
        specifier = "file://" + specifier;
        log(`patching file path for win32: ${specifier}`);
    }

    // Defer to Node.js for all other specifiers.
    return defaultResolve(specifier, context, defaultResolve);
}
