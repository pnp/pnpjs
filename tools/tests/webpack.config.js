const path = require("path");

module.exports = {
    entry: {
        "index": "./index.ts",
        "searchquerybuilder": "./searchquerybuilder.ts",
    },
    mode: "production",
    devtool: false,
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "awesome-typescript-loader",
                        options: {
                            useCache: false,
                            errorsAsWarnings: true,
                        },
                    },
                ],
            }],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        libraryTarget: "umd",
    },
};
