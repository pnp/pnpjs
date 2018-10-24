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
    getSubDirNames = require("../node-utils/getSubDirectoryNames"),
    config = require(path.resolve("./debug/serve/webpack.config.js"));


gulp.task("serve", (done) => {

    // check to see if you used a flag to serve a single package
    const args = cmdLine({});

    if (args.hasOwnProperty("packages") && args.packages.length > 0) {

        if (args.packages.length > 1) {
            throw new Error("You can only specify a single package when using serve.");
        }

        log(`Serving package: ${args.packages[0]}`);

        // update the entry point to be the package that was requested
        config.entry = `./packages/${args.packages[0]}/index.ts`;

        // update to use the config file for build of a specific package
        configFileName = "tsconfig.es5.json";

        // update the library to match what would be generated
        if (args.packages[0].toLowerCase() === "pnpjs") {
            library = "pnp";
        } else {
            library = `pnp.${args.packages[0]}`;
        }
    }

    const serverSettings = {
        publicPath: "/assets/",
        stats: {
            colors: true
        },
        https: true
    };

    // Start a webpack-dev-server
    new server(webpack(config), serverSettings).listen(8080, "localhost", (err) => {

        if (err) {
            return done(new gutil.PluginError("serve", err));
        }

        log("File will be served from:", colors.bgBlue(colors.white("https://localhost:8080/assets/pnp.js")));
    });
});
