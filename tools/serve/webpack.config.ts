import { join, dirname, resolve } from "path";
import PathsPlugin from "tsconfig-paths-webpack-plugin";
import * as findup from "findup-sync";

// give outselves a single reference to the projectRoot
const projectRoot = resolve(dirname(findup("package.json")));

const version = require(join(projectRoot, "package.json")).version;

export default {
    devtool: "source-map",
    entry: join(projectRoot, "debug", "serve", "main.ts"),
    mode: "development",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{
                    loader: "ts-loader",
                },
                {
                    loader: "string-replace-loader",
                    options: {
                        replace: version,
                        search: "$$Version$$",
                    },
                },
                ],
            },
        ],
    },
    output: {
        filename: "pnp.js",
        library: "pnp",
        libraryTarget: "umd",
        path: join(projectRoot, "serve"),
        publicPath: "/assets/",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
        plugins: [new PathsPlugin({ configFile: join(projectRoot, "debug", "serve", "tsconfig.json") })],
    },
    stats: {
        assets: false,
        colors: true,
    },
};
