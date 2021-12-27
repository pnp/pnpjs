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
            resolve("./packages/tsconfig.esm.json"),
            resolve("./packages/tsconfig.cjs.json"),
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
                    Tasks.Package.createCopyTargetFiles("", "", [function (file, _enconding, cb) {
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

        postPackageTasks: [],
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
            resolve("./dist/packages/esm"),
            resolve("./dist/packages/commonjs"),
        ],

        prePublishTasks: [],

        publishTasks: [Tasks.Publish.publishBetaPackage],

        postPublishTasks: [],
    },
    <PublishSchema>{

        name: "publish-v3nightly",

        role: "publish",

        packageRoots: [
            resolve("./dist/packages/esm"),
            resolve("./dist/packages/commonjs"),
        ],

        prePublishTasks: [Tasks.Publish.updateV3NightlyVersion],

        publishTasks: [Tasks.Publish.publishV3Nightly],

        postPublishTasks: [],
    },
];
