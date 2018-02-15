const gulp = require("gulp"),
    replaceExt = require("replace-ext"),
    tap = require("gulp-tap"),
    pump = require("pump"),
    hljs = require("highlight.js"),
    replace = require("gulp-replace"),
    MarkdownIt = new require("markdown-it"),
    fs = require("fs"),
    path = require("path"),
    semver = require("semver"),
    execSync = require('child_process').execSync,
    serverFactory = require("@pnp/dev-server"),
    sequence = require("run-sequence"),
    pkg = require(path.resolve(__dirname, "../../package.json"));

// the root of our docs src
const docsSrcRoot = path.resolve(__dirname, "../../docs-src");

// this is our markdown processor and configuration
const md = new MarkdownIt({
    xhtmlOut: true,
    linkify: true,
    typographer: true,
    html: true,
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
    file.path = replaceExt(file.path, ".html");
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

function filePathReplacer() {
    return this.file.relative;
}

function breadcumbReplacer() {

    return [`<a href="/pnp">@pnp</a>`]
        .concat(this.file.relative.split(/\\|\//).map((p, i, arr) => {
            return `<a href="/pnp/${arr.slice(0, i + 1).join("/")}">${replaceExt(p.replace(/-/g, " "), "")}</a>`;
        }))
        .join("&nbsp;&nbsp;&gt;&nbsp;&nbsp;");
}

gulp.task("docs:copyassets", (done) => {

    pump([
        gulp.src([
            "./docs-src/**/*.css",
        ]),
        gulp.dest("docs",
            {
                overwrite: true,
            }),
    ], (err) => {

        if (typeof err !== "undefined") {
            done(err);
        } else {
            done();
        }
    });
});

gulp.task("docs:generate", (done) => {

    getHeaderFooter(path.join(docsSrcRoot, "templates/article.html"), "$$content$$").then(hf => {

        // we need to take the md files in /docs-src and each package directory and transform them to html and put them in /docs
        pump([
            gulp.src([
                "./docs-src/**/*.md",
                "./packages/**/docs/*.md",
            ]),
            tap.apply(tap, [mdToHtml].concat(hf.map(s => new Buffer(s)))),
            tap(removeDocsSubPath),
            replace("$$OriginalFilePath$$", filePathReplacer),
            replace("$$Version$$", pkg.version),
            replace("$$breadcumbs$$", breadcumbReplacer),
            gulp.dest("docs", {
                overwrite: true,
            }),
        ], (err) => {

            if (typeof err !== "undefined") {
                done(err);
            } else {
                done();
            }
        });
    });
});

// watch the docs and rebuild the site if they change
gulp.task("watch:docs", ["docs"], function () {
    gulp.watch([
        "./docs-src/**/*.*",
        "./packages/**/docs/*.md",
    ], ["docs:generate", "docs:copyassets"]);
});

gulp.task("docs", ["clean-docs", "docs:copyassets", "docs:generate"]);

gulp.task("docs-serve", (done) => {

    sequence("clean-docs", "watch:docs", () => {
        serverFactory({
            root: "./docs",
            path: "/pnp",
        }).then(server => {

            console.log(`server.listening: ${server.listening}`);
        }).catch(e => {

            done(e);
        });
    });
});
