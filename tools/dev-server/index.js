const
    connect = require("connect"),
    serveStatic = require("serve-static"),
    util = require("gulp-util"),
    reload = require("tiny-lr"),
    opn = require("opn"),
    connectReload = require("connect-livereload"),
    watch = require("watch"),
    semver = require("semver"),
    execSync = require('child_process').execSync,
    url = require("url");

module.exports = (opts) => {

    return new Promise((resolve, reject) => {

        const options = Object.assign({
            root: "./",
            path: "/",
            port: 8888,
            livereload: true,
            open: true,
            debug: false,
        }, opts);

        const serveUrl = url.resolve(`http://localhost:${options.port}/`, options.path).toString();

        if (options.debug) {
            console.log(`@pnp/dev-server:: options: ${JSON.stringify(options, null, 4)}`);
            console.log(`@pnp/dev-server:: serveUrl: ${serveUrl}`);
        }

        const _server = connect();

        if (options.livereload) {

            const lrServer = reload();

            lrServer.listen();

            // watch docs folder to trigger reload once docs are rebuilt by watch:docs
            watch.watchTree(options.root, (filename) => {

                if (options.debug) {
                    console.log(`@pnp/dev-server:: watch triggered, filename: ${filename}`);
                }

                lrServer.changed({
                    body: {
                        files: filename
                    }
                });
            });

            // this middleware injects the script for the reload file into the page response
            _server.use(connectReload());
        }

        // server the static files
        _server.use(options.path, serveStatic(options.root));

        // start the server and listen, return the server instance
        resolve(_server.listen(options.port, () => {

            util.log("Server running at:", util.colors.bgBlue.white(serveUrl));

            if (options.open) {
                opn(serveUrl);
            }
        }));
    });
}
