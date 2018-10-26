// declare var require: (s: string) => any;
// import { PackageContext } from "./context";
// import { src, dest } from "gulp";
// const pump = require("pump"),
//     tap = require("gulp-tap");

// const header = (pkg) => [
//     "/**",
//     `@license`,
//     ` * ${pkg.name} v${pkg.version} - ${pkg.description}`,
//     ` * ${pkg.license} (https://github.com/pnp/pnpjs/blob/master/LICENSE)`,
//     ` * Copyright (c) ${new Date().getFullYear()} Microsoft`,
//     " * docs: https://pnp.github.io/pnpjs/",
//     ` * source: ${pkg.homepage}`,
//     ` * bugs: ${pkg.bugs.url}`,
//     " */",
//     "",
// ].join("\n");

// // remove the docs subpath for packages folders
// function addHeader(file, a, b, headerBuffer) {
//     file.contents = Buffer.concat([headerBuffer, file.contents]);
// }

// /**
//  * Copies static assets into the target folder
//  * 
//  * @param ctx The build context 
//  */
// export function banner(ctx: PackageContext) {

//     return new Promise((resolve, reject) => {

//         const headerBuffer = new Buffer(header(ctx.pkgObj));

//         pump([
//             src("./dist/**/*.js", {
//                 cwd: ctx.targetFolder,
//             }),
//             tap(addHeader, headerBuffer),
//             dest("./dist", {
//                 cwd: ctx.targetFolder,
//                 overwrite: true,
//             }),
//         ], (err: (Error | null)) => {

//             if (err !== undefined) {
//                 reject(err);
//             } else {
//                 resolve();
//             }
//         });
//     });
// }
