const gulp = require("gulp"),
    util = require("gulp-util"),
    tap = require("gulp-tap"),
    pump = require("pump"),
    hljs = require("highlight.js"),
    header = require("gulp-header"),
    footer = require("gulp-footer"),
    MarkdownIt = new require("markdown-it"),
    fs = require('fs'),
    path = require('path');

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

// watch the docs and rebuild the site if they change
gulp.task("watch:docs", function () {
    gulp.watch([
        "./docs-src/**/*.md",
        "./packages/**/docs/*.md",
    ], ["docs"]);
});

// translate the md to html
function mdToHtml(file, a, b, header, footer) {
    const result = md.render(file.contents.toString());
    file.contents = Buffer.concat([header, new Buffer(result), footer]);
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

gulp.task("docs", ["clean:docs"], (done) => {

    // we need to take the md files in /docs-src and each package directory and transform them to html and put them in /docs
    getHeaderFooter(path.join(docsSrcRoot, "templates/article.html"), "$$content$$").then(hf => {

        pump([
            gulp.src([
                "./docs-src/**/*.md",
                "./packages/**/docs/*.md",
            ]),
            tap.apply(tap, [mdToHtml].concat(hf.map(s => new Buffer(s)))),
            tap(removeDocsSubPath),
            gulp.dest("./docs"),
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

    // have a link in the footer to report issues with a docs page

    // update link in page footer to include a path to the docs page that needs help
});
