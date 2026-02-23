'use strict';

const build = require('@microsoft/sp-build-web');
const path = require("path");
const fs = require("fs");

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

const basePath = path.resolve("./../../build/packages");

let watchPnPjsLocalFiles = build.subTask('watch-pnpjs-local', function (gulp, buildOptions, done) {

  gulp.watch(path.join(basePath, "**/*.js"), async () => {

    try {

      const time = new Date();
      await fs.utimes("./src/index.ts", time, time);

    } catch (err) {

      await fs.close(fs.openSync("./src/index.ts", 'w'));
    }
  });

  done();
});

build.rig.addPreBuildTask(watchPnPjsLocalFiles);

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {

    // This is a webpack 4 style resolver plug-in.
    // TODO: update once SPFx is webpack 5 (or handle both? / detect?)
    generatedConfiguration.resolve.plugins = [{

      apply: (resolver) => {

        var target = resolver.ensureHook("undescribed-raw-file");

        resolver.getHook("beforeResolve").tapAsync("PnPjsLocalTestingResolver", (request, resolveContext, callback) => {

          const searchPath = resolver.join(request.path, request.request || "");

          if (/[\\|/]node_modules[\\|/]@pnp[\\|/]/.test(searchPath)) {

            let requestPath = /[\\|/]@pnp[\\|/](.*$)/.exec(searchPath)[1];

            var filePath = resolver.join(basePath, requestPath);

            if (!/\.js$/.test(filePath)) {

              if (fs.existsSync(`${filePath}.js`)) {
                filePath = filePath + ".js";
              } else {
                filePath = resolver.join(filePath, "index.js");
              }
            }

            // console.log(`rewrite: ${searchPath} => ${filePath}`);

            var obj = Object.assign({}, request, {
              path: filePath,
              relativePath: undefined,
            });

            resolver.doResolve(target, obj, `using path: ${filePath}`, resolveContext, callback);

          } else {

            callback();
          }
        });
      },
    }];

    return generatedConfiguration;
  }
});

build.initialize(require('gulp'));
