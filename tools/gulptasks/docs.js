const gulp = require("gulp"),
    util = require("gulp-util"),
    tap = require("gulp-tap"),
    pump = require("pump"),
    hljs = require("highlight.js"),
    replace = require("gulp-replace"),
    MarkdownIt = new require("markdown-it"),
    fs = require("fs"),
    path = require("path"),
    connect = require("connect"),
    serveStatic = require("serve-static"),
    reload = require("tiny-lr"),
    opn = require("opn"),
    connectReload = require("connect-livereload"),
    watch = require("watch");

// the root of our docs src
const docsSrcRoot = path.resolve(__dirname, "../../docs-src");

// this is our markdown processor and configuration
const md = new MarkdownIt({
    xhtmlOut: true,
    linkify: true,
    typographer: true,
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (_) { }
        }

        return ''; // use external default escaping
    },
    replaceLink: function (link, env) {
        if (/\.md$/i.test(link)) {
            return link.replace(/\.md$/, ".html");
        }

        return link;
    }
});

// replace links plugin
md.use(require('markdown-it-replace-link'));

// embed youtube player
md.use(require('markdown-it-video', {
    youtube: { width: 640, height: 390 }
}));

// translate the md to html
function mdToHtml(file, a, b, header, footer) {
    const result = md.render(file.contents.toString());

    // append tracking image tag
    const telemetryPath = path.relative(file.base, file.path).replace(/\.md$/i, "").replace(/\\/ig, "/");
    const img = new Buffer(`<img src="https://telemetry.sharepointpnp.com/@pnp/pnp/ghpages/${telemetryPath}" alt="spacer" />`);

    file.contents = Buffer.concat([header, new Buffer(result), footer, img]);
    file.path = util.replaceExtension(file.path, '.html');
}

// remove the docs subpath for packages folders
function removeDocsSubPath(file) {
    file.path = file.path.replace("docs\\", "");
}

// gets the header and footer async as an array with [0] = header, [1] = footer
function getHeaderFooter(filePath, splitString) {

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data.split(splitString));
        });
    });
}

gulp.task("docs:copyassets", ["clean-docs"], (done) => {

    pump([
        gulp.src([
            "./docs-src/**/*.css",
        ]),
        gulp.dest("docs"),
    ], (err) => {

        if (typeof err !== "undefined") {
            done(err);
        } else {
            done();
        }
    });
});

gulp.task("docs:generate", ["docs:copyassets"], (done) => {

    getHeaderFooter(path.join(docsSrcRoot, "templates/article.html"), "$$content$$").then(hf => {

        // we need to take the md files in /docs-src and each package directory and transform them to html and put them in /docs
        pump([
            gulp.src([
                "./docs-src/**/*.md",
                "./packages/**/docs/*.md",
            ]),
            tap.apply(tap, [mdToHtml].concat(hf.map(s => new Buffer(s)))),
            tap(removeDocsSubPath),
            replace("$$OriginalFilePath$$", function () {
                // allows for the inclusion of the path in the issue title link in footer
                return this.file.relative;
            }),
            gulp.dest("docs"),
        ], (err) => {

            if (typeof err !== "undefined") {
                done(err);
            } else {
                done();
            }
        });
    });

    // we need to build the script files for the site (ts) then webpack those and put them in the docs/scripts folder

    // we need to write a package index page to link to all the package docs

});

// watch the docs and rebuild the site if they change
gulp.task("watch:docs", ["docs"], function () {
    gulp.watch([
        "./docs-src/**/*.*",
        "./packages/**/docs/*.md",
    ], ["docs:generate"]);
});

gulp.task("docs", ["clean-docs", "docs:copyassets", "docs:generate"]);

gulp.task("docs-serve", ["watch:docs"], (done) => {

    const lrServer = reload();
    lrServer.listen();

    // watch docs folder to trigger reload once docs are rebuilt by watch:docs
    watch.watchTree("./docs", {}, function (filename) {
        lrServer.changed({
            body: {
                files: filename
            }
        });
    });

    // setup and launch the connect server
    connect()
        .use(connectReload())
        .use("/pnp", serveStatic("./docs"))        
        .listen(8888, () => {

            util.log("Docs served from:", util.colors.bgBlue.white("http://localhost:8888/pnp"));
            opn("http://localhost:8888/pnp");
        });
});
