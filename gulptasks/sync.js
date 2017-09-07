//******************************************************************************
//* sync.js
//*
//* Defines a custom gulp task for serving up content from the server-root 
//* local folder, setup file/folder watchers so that changes are reflected
//* on file save, and open the default browser to the default html page. 
//******************************************************************************
var gulp = require("gulp"),
    gutil = require("gulp-util"),
    config = require("./@configuration"),
    spsave = require("gulp-spsave");

gulp.task("_upload", ["package:sync"], () => {

    // will use the same clientId & clientSecret from settings
    // let creds = {
    //     clientId: config.settings.testing.clientId,
    //     clientSecret: config.settings.testing.clientSecret
    // };

    // will use the specific username/password entered in the spsave settings
    let creds = {
        username: config.settings.spsave.username,
        password: config.settings.spsave.password,
    };

    return gulp.src(config.paths.dist + "/**/*.js").pipe(spsave(
        {
            folder: "Style%20Library/pnp",
            checkin: true,
            checkinType: 1,
            siteUrl: config.settings.spsave.siteUrl
        },
        creds));
});

gulp.task("sync", ["clean", "_upload"], function() {
    return gulp.watch(config.paths.sourceGlob, ["_upload"]);
});
