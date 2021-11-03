import { join, dirname, resolve } from "path";
import findup from "findup-sync";
import { LocalModuleResolverPlugin } from "./local-module-resolver-plugin.js"

// give ourselves a single reference to the projectRoot
const projectRoot = resolve(dirname(findup("package.json")));

export default {
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
    resolve: {
        extensions: ["*", ".js", ".json"],
        plugins: [new LocalModuleResolverPlugin({ packageResolveBasePath: join(projectRoot, "build/server/packages") })],
    },
    stats: {
        assets: false,
        colors: true,
    },
};
