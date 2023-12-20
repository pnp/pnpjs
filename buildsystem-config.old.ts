import { resolve } from "path";
import { ConfigCollection, BuildSchema, Tasks, PackageSchema, PublishSchema } from "@pnp/buildsystem";

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
            // this task replaces the $$Version$$ with the version from the root package.json at build time
            Tasks.Build.createReplaceVersion([
                "sp/behaviors/telemetry.js",
                "graph/behaviors/telemetry.js",
            ]),
        ],
    },
    <PackageSchema>{

        name: "package",

        role: "package",

        prePackageTasks: [],

        packageTargets: [
            {
                outDir: resolve("./dist/packages"),
                target: resolve("./packages/tsconfig.json"),
                tasks: [
                    Tasks.Package.createCopyTargetFiles(),
                    Tasks.Package.copyStaticAssets,
                    Tasks.Package.createCopyPackageScripts(),
                    Tasks.Package.createWritePackageFiles((p) => {
                        return Object.assign({}, p, {
                            funding: {
                                type: "individual",
                                url: "https://github.com/sponsors/patrick-rodgers/",
                            },
                            type: "module",
                            engines: {
                                node: ">=14.15.1"
                            },
                            author: {
                                name: "Microsoft and other contributors"
                            },
                            license: "MIT",
                            bugs: {
                                url: "https://github.com/pnp/pnpjs/issues"
                            },
                            homepage: "https://github.com/pnp/pnpjs",
                            repository: {
                                type: "git",
                                url: "git:github.com/pnp/pnpjs"
                            }
                        });
                    }),
                ],
            },
        ],

        postPackageTasks: [],
    },
    <PublishSchema>{

        name: "publish",

        role: "publish",

        packageRoots: [
            resolve("./dist/packages"),
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

            Tasks.Build.createReplaceVersion([
                "packages/sp/behaviors/telemetry.js",
                "packages/graph/behaviors/telemetry.js",
            ]),
        ],
    },
    <PublishSchema>{

        name: "publish-beta",

        role: "publish",

        packageRoots: [
            resolve("./dist/packages"),
        ],

        prePublishTasks: [],

        publishTasks: [Tasks.Publish.publishBetaPackage],

        postPublishTasks: [],
    },
    <PublishSchema>{

        name: "publish-v3nightly",

        role: "publish",

        packageRoots: [
            resolve("./dist/packages"),
        ],

        prePublishTasks: [Tasks.Publish.updateV3NightlyVersion],

        publishTasks: [Tasks.Publish.publishV3Nightly],

        postPublishTasks: [],
    },
];
