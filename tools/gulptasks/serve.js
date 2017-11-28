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
    config = require(path.join(projectRoot, "webpack-serve.config.js")),
    cmdLine = require("./args").processConfigCmdLine;

gulp.task("serve", (done) => {

    let serverSettings = {
        publicPath: config.output.publicPath,
        stats: {
            colors: true
        },
        https: true
    };

    // check to see if you used a flag to serve a single package
    const args = cmdLine({});
    if (args.hasOwnProperty("packages") && args.packages.length > 0) {
        
        if (args.packages.length > 1) {
            throw new Error("You can only specify a single package when using serve.");
        }

        // update the entry point to be the package that was requested
        config.entry = `./packages/${args.packages[0]}/index.ts`;
    }

    // Start a webpack-dev-server
    new server(webpack(config), serverSettings).listen(8080, "localhost", (err) => {
        
        if (err) {
            throw new gutil.PluginError("serve", err);
        }

        gutil.log("File will be served from:", gutil.colors.bgBlue.white("https://localhost:8080/assets/pnp.js"));
    });
});
