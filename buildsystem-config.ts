import { resolve } from "path";
import { ConfigCollection, BuildSchema, Tasks, PackageSchema, PublishSchema } from "./tools/buildsystem";

export default <ConfigCollection>[
    <BuildSchema>{
        exclude: ["documentation"],

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

        postPackageTasks: [],
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
