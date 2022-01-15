import webpack from "webpack";
import { join, dirname, resolve } from "path";
import findup from "findup-sync";
import { LocalModuleResolverPlugin } from "./local-module-resolver-plugin.js"
import { readFileSync } from "fs";

// give ourselves a single reference to the projectRoot
const packagePath = findup("package.json");
const projectRoot = resolve(dirname(packagePath));
const packageFile: { version: string } = JSON.parse(readFileSync(packagePath).toString());

export default <webpack.Configuration>{
    devtool: "source-map",
    entry: join(projectRoot, "build", "server", "debug", "serve", "main.js"),
    mode: "development",
    output: {
        filename: "pnp.js",
        library: "pnp",
        libraryTarget: "umd",
        path: join(projectRoot, "serve"),
        publicPath: "/assets/",
    },
    module: {
        rules: [
            {
                test: /telemetry\.[tj]s$/,
                loader: "string-replace-loader",
                options: {
                    search: "$$Version$$",
                    replace: packageFile.version,
                }
            }
        ]
    },
    resolve: {
        extensions: ["*", ".js", ".json"],
        plugins: [new LocalModuleResolverPlugin({ packageResolveBasePath: join(projectRoot, "build/server/packages") })],
    },
    stats: {
        assets: false,
        colors: true,
    },
};
