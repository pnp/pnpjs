declare var require: (s: string) => any;
import { PackageContext } from "./context";
import { src, dest } from "gulp";
const webpack = require("webpack");
const path = require("path");

interface ResolutionInfo {
    request: string;
}

/**
 * handles mapping the @pnp paths to the local ./dist/packages
 */
class PnPLocalResolver {

    constructor(protected source: string, protected target: string) { }

    public apply(resolver) {

        resolver.plugin(this.source, (info: ResolutionInfo, callback: (err?: any, result?: any) => any): any => {

            if (/^@pnp\//i.test(info.request)) {

                const moduleName = /^@pnp\/([\w-]*?)$/i.exec(info.request)[1];

                const o: ResolutionInfo = Object.assign({}, info, {
                    request: path.resolve("./dist/packages", moduleName),
                });

                return resolver.doResolve(this.target, o, `PnPLocalResolver :: '${info.request}' mapped to '${o.request}'.`, callback);

            } else {
                return callback();
            }
        });
    }
}

/**
 * Bundles a library using webpack along with its @pnp dependencies.
 * This will result in large file sizes and is not ideal, but does provide
 * a way for folks who want a single file they can drop into their
 * applications.
 * 
 * @param ctx The build context 
 */
export function bundle(ctx: PackageContext) {

    // create our webpack config
    const config = {
        cache: true,
        devtool: "source-map",
        entry: `./build/packages/${ctx.name}/es5/index.js`,
        output: {
            filename: `${ctx.name}.es5.umd.bundle.js`,
            library: "pnp",
            libraryTarget: "umd",
            path: path.join(ctx.targetFolder, "dist"),
        },
        plugins: [
            new webpack.BannerPlugin({ banner: "// TODO:: banner", entryOnly: true, raw: true }),
            new webpack.DefinePlugin({
                "process.env": {
                    "NODE_ENV": JSON.stringify("production"),
                },
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
            }),
        ],
        resolve: {
            extensions: [".js"],
            plugins: [new PnPLocalResolver("described-resolve", "resolve")],
        },
    };

    return new Promise((resolve, reject) => {

        webpack(config, (err, stats) => {

            if (err) {
                reject(err);
            }

            console.log(stats.toString({
                colors: true,
            }));

            resolve();
        });
    });
}
