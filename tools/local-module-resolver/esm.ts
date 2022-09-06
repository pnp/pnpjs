import { join, resolve, dirname, isAbsolute, basename } from "path";
import { existsSync } from "fs";
import findup from "findup-sync";

// give ourselves a single reference to the projectRoot
const projectRoot = resolve(dirname(findup("package.json")));

function log(_message: string) {
    // console.log(`PnP Node Local Module Loader: ${message}`);
}

log("Loaded");
log(`process.platform: ${process.platform}`);

const cache = new Map<string, ResolvedValue>();

export function createResolve(innerPath: string): ResolverFunc {

    return async function (specifier: string, context: ResolveContext, defaultResolve: ResolverFunc): Promise<ResolvedValue> {

        if (specifier.startsWith("@pnp")) {

            const modulePath = specifier.substring(4);

            if (cache.has(modulePath)) {
                return cache.get(modulePath);
            }

            let candidate = join(projectRoot, innerPath, modulePath);

            if (existsSync(candidate + ".js")) {

                candidate = candidate + ".js"

            } else if (basename(candidate).toLowerCase() !== "index.js") {

                candidate = join(candidate, "index.js");
            }

            try {

                const url = new URL("file://" + candidate).href;

                log(`Resolved: ${specifier} => ${url}`);

                const resolved: ResolvedValue = {
                    url,
                    format: "module",
                    shortCircuit: true,
                };

                cache.set(modulePath, resolved);

                return resolved;

            } catch (e) {

                console.error(`Error in local module resolver candidate url: ${candidate}.`)
                console.error(e);
                throw e;
            }
        }

        if (/^[^(file:\/\/)]/.test(specifier)) {

            if (isAbsolute(specifier)) {

                specifier = "file://" + specifier;

            } else {

                // any relative resolves will be our code (probably :))
                const localSpecifier = await Promise.resolve(defaultResolve(specifier, context, defaultResolve));

                if (localSpecifier.url.indexOf("node_modules") > -1 || localSpecifier.url.indexOf("node:") > -1) {

                    return localSpecifier;

                } else {

                    if (/^[^(file:\/\/)]/.test(localSpecifier.url)) {
                        localSpecifier.url = "file://" + localSpecifier.url;
                    }

                    return {
                        ...localSpecifier,
                        format: "module",
                        shortCircuit: true,
                    };
                }
            }
        }

        // Defer to Node.js for all other specifiers.
        return defaultResolve(specifier, context, defaultResolve);
    }
}

export interface ResolvedValue {
    url: string;
    format?: "module";
    shortCircuit?: boolean;
}

export interface ResolveContext {
    conditions?: [];
    parentUrl?: string | undefined;
}

export interface ResolverFunc {
    (specifier: string, context: ResolveContext, defaultResolve: ResolverFunc): Promise<ResolvedValue> | ResolvedValue;
}
