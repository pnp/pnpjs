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
    ` * ${pkg.license} (https://github.com/pnp/pnpjs/blob/master/LICENSE)`,
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
            resolve("./packages/tsconfig.json"),
        ],

        postBuildTasks: [
            // this task is scoped to the sp files within the task
            Tasks.Build.replaceSPHttpVersion,
        ],
    },
    <PackageSchema>{

        name: "package",

        role: "package",

        packageTargets: [{
            outDir: resolve("./dist/packages/"),
            packageTarget: resolve("./packages/tsconfig.json"),
        }],

        prePackageTasks: [],

        packageTasks: [
            // order matters here
            Tasks.Package.copyBuiltFiles,
            Tasks.Package.copyStaticAssets,
            Tasks.Package.writePackageFiles,
        ],

        postPackageTasks: [
            {
                // create the pnpjs bundle rolling up all library functionality
                // we re-build it from the original ts source so that the source map will allow
                // folks to see the orignal source when debugging
                task: webpack({
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
                                        configFile: resolve("./packages/pnpjs/tsconfig.json"),
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
                        path: resolve("./dist/packages/pnpjs/dist"),
                    },
                    performance: {
                        // we are making a big package, but this is designed to be non-optimal
                        maxAssetSize: 300000,
                        maxEntrypointSize: 300000,
                    },
                    plugins: [
                        new wp.BannerPlugin({
                            banner,
                            raw: true,
                        }),
                    ],
                    resolve: {
                        extensions: [".ts", ".tsx", ".js", ".json"],
                        plugins: [new TsconfigPathsPlugin({ configFile: resolve("./packages/pnpjs/tsconfig.json") })],
                    },
                    stats: {
                        assets: false,
                        colors: true,
                    },
                }),
            },
        ],
    },
    <PublishSchema>{

        name: "publish",

        role: "publish",

        packageRoot: resolve("./dist/packages"),

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

        packageRoot: resolve("./dist/packages"),

        prePublishTasks: [],

        publishTasks: [Tasks.Publish.publishBetaPackage],

        postPublishTasks: [],
    },
];
