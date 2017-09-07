//******************************************************************************
//* serve.js
//*
//* Defines a custom gulp task for serving up content from the server-root 
//* local folder, setup file/folder watchers so that changes are reflected
//* on file save, and open the default browser to the default html page. 
//******************************************************************************

var gulp = require("gulp"),
    tsc = require("gulp-typescript"),
    gutil = require("gulp-util"),
    webpack = require('webpack'),
    server = require("webpack-dev-server"),
    config = require("../webpack-serve.config.js");

gulp.task("serve", (done) => {

    let serverSettings = {
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
