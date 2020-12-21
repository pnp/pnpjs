import { join } from "path";
import { statSync, existsSync } from "fs";

export interface IOptions {
    packageResolveBasePath: string
}

export class LocalModuleResolverPlugin {

    constructor(private options: IOptions) { }

    public apply(resolver) {

        const target = resolver.ensureHook("resolved");

        resolver
            .getHook("module")
            .tapAsync("LocalModuleResolverPlugin", (request: { request: string }, resolveContext, callback) => {

                if (request.request.startsWith("./@pnp")) {

                    const resolvedPath = this.doResolve(request.request);

                    const obj = Object.assign({}, request, {
                        path: resolvedPath,
                    });

                    resolver.doResolve(target, obj, `resolve ${request.request} to ${resolvedPath}`, resolveContext, callback);

                } else {
                    callback();
                }
            });
    }

    private doResolve(candidate: string): string {

        // pick off the "./@pnp" from the front
        let resolvedPath = join(this.options.packageResolveBasePath, candidate.substring(6));

        if (!existsSync(resolvedPath)) {

            // let's try and stick a ".js" on the end for cases like "@pnp/sp/presets/all" and try again
            resolvedPath = resolvedPath + ".js";

            if (!existsSync(resolvedPath)) {
                throw Error(`Could not resolve candidate path ${candidate} resolved to ${resolvedPath} in LocalModuleResolverPlugin.`);
            }
        }

        // get some info
        const info = statSync(resolvedPath);

        if (info.isDirectory()) {

            resolvedPath = join(resolvedPath, "index.js");

        } else if (info.isFile()) {

            if (!resolvedPath.endsWith(".js")) {

                resolvedPath = resolvedPath + ".js";
            }
        }

        return resolvedPath;
    }
}