//******************************************************************************
//* serve.js
//*
//* Defines a custom gulp task for serving up content from the server-root 
//* local folder, setup file/folder watchers so that changes are reflected
//* on file save, and open the default browser to the default html page. 
//******************************************************************************

const path = require("path");

// give outselves a single reference to the projectRoot
const projectRoot = path.resolve(__dirname, "../..");

const gulp = require("gulp"),
    tsc = require("gulp-typescript"),
    gutil = require("gulp-util"),
    webpack = require('webpack'),
    server = require("webpack-dev-server"),
    cmdLine = require("./args").processConfigCmdLine,
    pkg = require(path.join(projectRoot, "package.json"));

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

gulp.task("serve", (done) => {

    // check to see if you used a flag to serve a single package
    const args = cmdLine({});
    let entry = "./debug/serve/main.ts";
    let configFileName = "tsconfig.json";
    let library = "pnp";
    
    if (args.hasOwnProperty("packages") && args.packages.length > 0) {

        if (args.packages.length > 1) {
            throw new Error("You can only specify a single package when using serve.");
        }

        gutil.log(`Serving package: ${args.packages[0]}`);

        // update the entry point to be the package that was requested
        entry = `./packages/${args.packages[0]}/index.ts`;

        // update to use the config file for build of a specific package
        configFileName = "tsconfig-build.json";

        // update the library to match what whould be generated
        library = `pnp.${args.packages[0]}`;
    }

    // our webpack config
    const config = {
        cache: true,
        entry: entry,
        output: {
            path: path.join(__dirname, "dist"),
            publicPath: "/assets/",
            filename: "pnp.js",
            libraryTarget: "umd",
            library: library,
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
                                rootDir: "../../",
                                strictNullChecks: false,
                                types: [
                                    "sharepoint"
                                ]
                            },
                            configFile: configFileName,
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

    const serverSettings = {
        publicPath: config.output.publicPath,
        stats: {
            colors: true
        },
        https: true
    };

    // Start a webpack-dev-server
    new server(webpack(config), serverSettings).listen(8080, "localhost", (err) => {

        if (err) {
            throw new gutil.PluginError("serve", err);
        }

        gutil.log("File will be served from:", gutil.colors.bgBlue.white("https://localhost:8080/assets/pnp.js"));
    });
});
