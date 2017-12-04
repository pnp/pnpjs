const gulp = require("gulp"),
    del = require("del"),
    util = require("gulp-util"),
    tap = require("gulp-tap"),
    pump = require("pump"),
    hljs = require('highlight.js'),
    MarkdownIt = new require("markdown-it");

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

gulp.task("clean-docs", (done) => {
    del("./docs").then(() => {
        done();
    });
});

gulp.task("watch:docs", function () {
    gulp.watch([
        "./docs-src/**/*.md",
        "./packages/**/docs/*.md",
    ], ["docs"]);
});


// translate the md to html
function mdToHtml(file) {


    const result = md.render(file.contents.toString());
    file.contents = new Buffer(result);
    file.path = util.replaceExtension(file.path, '.html');
}

// remove the docs subpath for packages folders
function removeDocsSubPath(file) {
    file.path = file.path.replace("docs\\", "");
}

gulp.task("docs", ["clean-docs"], (done) => {

    // we need to take the md files in /docs-src and each package directory and transform them to html and put them in /docs
    pump([
        gulp.src([
            "./docs-src/**/*.md",
            "./packages/**/docs/*.md",
        ]),
        tap(mdToHtml),
        tap(removeDocsSubPath),
        gulp.dest("./docs"),
    ], (err) => {

        if (typeof err !== "undefined") {
            done(err);
        } else {
            done();
        }
    });


    // we need to build the script files for the site (ts) then webpack those and put them in the docs/scripts folder


    // we need to write a package index page to link to all the package docs

    // we need to add a header/footer/surrounding code to each page as it is processed


});
