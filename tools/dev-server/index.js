const
    connect = require("connect"),
    serveStatic = require("serve-static"),
    reload = require("tiny-lr"),
    opn = require("opn"),
    connectReload = require("connect-livereload"),
    watch = require("watch"),
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
            logFunc: (m) => console.log(m),
        }, opts);

        const serveUrl = url.resolve(`http://localhost:${options.port}/`, options.path).toString();

        if (options.debug) {
            options.logFunc(`@pnp/dev-server:: options: ${JSON.stringify(options, null, 4)}`);
            options.logFunc(`@pnp/dev-server:: serveUrl: ${serveUrl}`);
        }

        const _server = connect();

        if (options.livereload) {

            const lrServer = reload();

            lrServer.listen();

            // watch docs folder to trigger reload once docs are rebuilt by watch:docs
            watch.watchTree(options.root, (filename) => {

                if (options.debug) {
                    logFunc(`@pnp/dev-server:: watch triggered, filename: ${filename}`);
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

            if (options.debug) {
                options.logFunc(`Server started and listening at ${serveUrl}`);
            }

            if (options.open) {
                opn(serveUrl);
            }
        }));
    });
}
