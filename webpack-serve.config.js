var path = require("path"),
    pkg = require("./package.json"),
    webpack = require('webpack');

/**
 * handles mapping the @pnp paths to the local ./packages
 */
class PnPLocalResolver {

    constructor(source, target) {
        this.source = source;
        this.target = target;
    }

    apply(resolver) {

        resolver.plugin(this.source, (info, callback) => {

            if (/^@pnp\//i.test(info.request)) {

                const moduleName = /^@pnp\/([\w-]*?)$/i.exec(info.request)[1];

                const o = Object.assign({}, info, {
                    request: path.resolve("./packages", moduleName),
                });

                return resolver.doResolve(this.target, o, `PnPLocalResolver :: '${info.request}' mapped to '${o.request}'.`, callback);

            } else {
                return callback();
            }
        });
    }
}

module.exports = {
    // serve config
    cache: true,
    entry: './debug/serve/serve.ts',
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/assets/",
        filename: "pnp.js",
        libraryTarget: "umd",
        library: "$pnp"
    },
    devtool: "source-map",
    resolve: {
        enforceExtension: false,
        extensions: [".ts"],
        plugins: [new PnPLocalResolver("described-resolve", "resolve")],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{
                    loader: "ts-loader",
                    options: {
                        compilerOptions: {
                            rootDir: "../",
                            strictNullChecks: false,
                            types: [
                                "sharepoint"
                            ]
                        }
                    }
                },
                {
                    loader: "string-replace-loader",
                    options: {
                        search: "$$Version$$",
                        replace: pkg.version
                    }
                },
                ]
            },
        ]
    }
};
