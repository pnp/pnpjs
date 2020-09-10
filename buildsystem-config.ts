import { resolve } from "path";
import { ConfigCollection, BuildSchema, Tasks, PackageSchema, PublishSchema } from "./tools/buildsystem";
import { webpack } from "./tools/buildsystem/src/tasks/package/webpack";
import * as wp from "webpack";
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const pkg = require("./package.json");

const banner = [
    "/**",
    ` * @license`,
    ` * v${pkg.version}`,
    ` * ${pkg.license} (https://github.com/pnp/pnpjs/blob/main/LICENSE)`,
    ` * Copyright (c) ${new Date().getFullYear()} Microsoft`,
    " * docs: https://pnp.github.io/pnpjs/",
    ` * source: ${pkg.homepage}`,
    ` * bugs: ${pkg.bugs.url}`,
    " */",
].join("\n");

export default <ConfigCollection>[
    <BuildSchema>{

        name: "build",

        role: "build",

        packageRoot: resolve("./packages/"),

        preBuildTasks: [],

        // these tsconfig files will all be transpiled per the settings in the file
        buildTargets: [
            resolve("./packages/tsconfig.esm.json"),
            resolve("./packages/tsconfig.cjs.json"),
        ],

        postBuildTasks: [
            // this task is scoped to the files within the task
            Tasks.Build.replaceVersion,
        ],
    },
    <PackageSchema>{

        name: "package",

        role: "package",

        prePackageTasks: [],

        packageTargets: [
            {
                outDir: resolve("./dist/packages/esm"),
                target: resolve("./packages/tsconfig.esm.json"),
                tasks: [
                    Tasks.Package.createCopyTargetFiles(),
                    Tasks.Package.copyStaticAssets,
                    Tasks.Package.createWritePackageFiles((p) => {
                        return Object.assign({}, p, {
                            funding: {
                                "type": "individual",
                                "url": "https://github.com/sponsors/patrick-rodgers/",
                            },
                            type: "module",
                        });
                    }),
                ],
            },
            {
                outDir: resolve("./dist/packages/commonjs"),
                target: resolve("./packages/tsconfig.cjs.json"),
                tasks: [
                    Tasks.Package.createCopyTargetFiles("", "", [function(file, _enconding, cb) {
                        // we need to rewrite all the requires that use @pnp/something to be @pnp/something-commonjs

                        if (/\.js$|\.d\.ts$/i.test(file.path)) {

                            const content: string = file.contents.toString("utf8");
                            file.contents = Buffer.from(content.replace(/"\@pnp\/(\w*?)([\/|"])/ig, `"@pnp/$1-commonjs$2`));
                        }

                        cb(null, file);
                    }]),
                    Tasks.Package.copyStaticAssets,
                    Tasks.Package.createWritePackageFiles(p => {

                        const newP = Object.assign({}, p, {
                            funding: {
                                "type": "individual",
                                "url": "https://github.com/sponsors/patrick-rodgers/",
                            },
                            type: "commonjs",
                        });

                        // selective imports don't work in commonjs or matter for nodejs
                        // so we retarget main to the preset for these libraries (and update typings pointer)
                        if (newP.name.match(/\/sp$|\/graph$/)) {
                            newP.main = "./presets/all.js";
                            newP.typings = "./presets/all";
                        }

                        // update name field to include -commonjs
                        newP.name = `${newP.name}-commonjs`;

                        // and we need to rewrite the dependencies to point to the commonjs ones
                        if (newP.dependencies) {
                            const newDeps = {};
                            for (const key in newP.dependencies) {

                                if (key.startsWith("@pnp/")) {
                                    newDeps[`${key}-commonjs`] = newP.dependencies[key];
                                } else {
                                    newDeps[key] = newP.dependencies[key];
                                }
                            }

                            newP.dependencies = newDeps;
                        }

                        return newP;
                    }),
                ],
            },
        ],

        postPackageTasks: [
            webpack({
                devtool: "source-map",
                entry: resolve("./packages/pnpjs/index.ts"),
                mode: "production",
                module: {
                    rules: [
                        {
                            test: /\.ts$/,
                            use: [{
                                loader: "ts-loader",
                                options: {
                                    configFile: resolve("./packages/pnpjs/tsconfig.esm.json"),
                                    // we can't use transpile only mode, webpack produces a ton of warnings (errors in 5)
                                },
                            }],
                        },
                    ],
                },
                output: {
                    filename: "pnp.js",
                    library: "pnp",
                    libraryTarget: "umd",
                    path: resolve("./dist/packages/esm/pnpjs/dist"),
                },
                performance: {
                    // we are making a big package, but this is designed to be non-optimal
                    maxAssetSize: 400000,
                    maxEntrypointSize: 400000,
                },
                plugins: [
                    new wp.BannerPlugin({
                        banner,
                        raw: true,
                    }),
                ],
                resolve: {
                    extensions: [".ts", ".tsx", ".js", ".json"],
                    plugins: [new TsconfigPathsPlugin({ configFile: resolve("./packages/pnpjs/tsconfig.esm.json") })],
                },
                stats: {
                    assets: false,
                    colors: true,
                },
            }),
        ],
    },
    <PublishSchema>{

        name: "publish",

        role: "publish",

        packageRoots: [
            resolve("./dist/packages/esm"),
            resolve("./dist/packages/commonjs"),
        ],

        prePublishTasks: [],

        publishTasks: [Tasks.Publish.publishPackage],

        postPublishTasks: [],
    },
    <BuildSchema>{
        name: "build-debug",

        role: "build",

        packageRoot: resolve("./debug/"),

        exclude: [],

        preBuildTasks: [],

        buildTargets: [
            resolve("./debug/launch/tsconfig.json"),
        ],

        postBuildTasks: [
            Tasks.Build.replaceDebug,
        ],
    },
    <PublishSchema>{

        name: "publish-beta",

        role: "publish",

        packageRoots: [
            resolve("./dist/packages/esm"),
            resolve("./dist/packages/commonjs"),
        ],

        prePublishTasks: [],

        publishTasks: [Tasks.Publish.publishBetaPackage],

        postPublishTasks: [],
    },
];
