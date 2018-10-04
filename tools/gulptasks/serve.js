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
    webpack = require('webpack'),
    server = require("webpack-dev-server"),
    cmdLine = require("./args").processConfigCmdLine,
    pkg = require(path.join(projectRoot, "package.json")),
    log = require("fancy-log"),
    colors = require("ansi-colors"),
    getSubDirNames = require("../node-utils/getSubDirectoryNames");

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

        log(`Serving package: ${args.packages[0]}`);

        // update the entry point to be the package that was requested
        entry = `./packages/${args.packages[0]}/index.ts`;

        // update to use the config file for build of a specific package
        configFileName = "tsconfig.es5.json";

        // update the library to match what would be generated
        if (args.packages[0].toLowerCase() === "pnpjs") {
            library = "$pnp";
        } else {
            library = `pnp.${args.packages[0]}`;
        }
    }

    // our webpack config
    const config = {
        mode: "development",
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
            alias: {},
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

    const packageDirs = getSubDirNames("./packages");

    // we need to setup the alias values for the local packages for bundling
    for (let i = 0; i < packageDirs.length; i++) {
        config.resolve.alias[`@pnp/${packageDirs[i]}`] = path.resolve(`./build/packages/${packageDirs[i]}/es5`);
    }

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

        log("File will be served from:", colors.bgBlue(colors.white("https://localhost:8080/assets/pnp.js")));
    });
});
