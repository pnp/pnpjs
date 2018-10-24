const path = require("path"),
    TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// give outselves a single reference to the projectRoot
const projectRoot = path.resolve(__dirname, "../..");

const version = require(path.join(projectRoot, "package.json")).version;

module.exports = {
    mode: "development",
    entry: path.join(projectRoot, "debug", "serve", "main.ts"),
    output: {
        path: path.join(projectRoot, "serve"),
        publicPath: "/assets/",
        filename: "pnp.js",
        libraryTarget: "umd",
        library: "$pnp",
    },
    devtool: "source-map",
    resolve: {
        extensions: [ '.ts', '.tsx', ".js", ".json"],
        plugins: [new TsconfigPathsPlugin({ configFile: path.join(projectRoot, "debug", "serve", "tsconfig.json") })],
    },
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
                        search: "$$Version$$",
                        replace: version
                    }
                },
                ]
            },
        ]
    },
    stats: {
        assets: false,
        colors: true,
    }
};
