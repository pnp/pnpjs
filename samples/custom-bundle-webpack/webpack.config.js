module.exports = {
    devtool: "source-map",
    entry: "./index.ts",
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{
                    loader: "ts-loader",
                }],
            },
        ],
    },
    output: {
        filename: "pnp.js",
        library: "pnp",
        libraryTarget: "umd",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
    },
    stats: {
        assets: false,
        colors: true,
    },
};
