import { resolve } from "path";
import {
    BuildSchema,
    BuildTimeline,
    Build,
    ReplaceVersion,
    CopyPackageFiles,
    CopyAssetFiles,
    WritePackageJSON,
    Publish,
    PublishNightly,
} from "@pnp/buildsystem";
import {
    Logger,
    ConsoleListener,
    LogLevel,
    PnPLogging,
} from "@pnp/logging";

Logger.subscribe(ConsoleListener("", {
    color: "skyblue",
    error: "red",
    verbose: "lightslategray",
    warning: "yellow",
}));

const logLevel = LogLevel.Verbose;
const distFolder = "./dist/packages";
const commonPublishTags = ["--access", "public"];

function PnPBuild(): (b: BuildTimeline) => BuildTimeline {

    return (instance: BuildTimeline) => {

        Build()(instance);
        ReplaceVersion(["sp/behaviors/telemetry.js", "graph/behaviors/telemetry.js"])(instance);

        return instance;
    }
}

function PnPPackage(): (b: BuildTimeline) => BuildTimeline {

    return (instance: BuildTimeline) => {

        CopyPackageFiles("src", ["**/*.cjs"])(instance);
        CopyAssetFiles(".", ["LICENSE"])(instance);
        CopyAssetFiles("./packages", ["readme.md"])(instance);
        CopyPackageFiles("built", ["**/*.d.ts", "**/*.js", "**/*.js.map", "**/*.d.ts.map"])(instance);
        WritePackageJSON((p) => {
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
        })(instance);

        return instance;
    }
}

function PnPPublish(flags?: string[]): (b: BuildTimeline) => BuildTimeline {

    return (instance: BuildTimeline) => {

        Publish(flags)(instance);

        return instance;
    }
}

const commonBehaviors = [
    PnPLogging(logLevel),
]

export default [<BuildSchema>{
    name: "build",
    distFolder,
    targets: [
        resolve("./packages/tsconfig.json"),
    ],
    behaviors: [PnPBuild(), ...commonBehaviors],
},
{
    name: "build-debug",
    distFolder,
    targets: [
        resolve("./debug/launch/tsconfig.json"),
    ],
    behaviors: [Build(), ReplaceVersion(["packages/sp/behaviors/telemetry.js", "packages/graph/behaviors/telemetry.js"]), ...commonBehaviors],
},
{
    name: "package",
    distFolder,
    targets: [
        resolve("./packages/tsconfig.json"),
    ],
    behaviors: [PnPBuild(), PnPPackage(), ...commonBehaviors],
},
{
    name: "publish",
    distFolder,
    targets: [
        resolve("./packages/tsconfig.json"),
    ],
    behaviors: [PnPBuild(), PnPPackage(), PnPPublish(commonPublishTags), ...commonBehaviors],
},
{
    name: "publish-beta",
    distFolder,
    targets: [
        resolve("./packages/tsconfig.json"),
    ],
    behaviors: [PnPBuild(), PnPPackage(), PnPPublish([...commonPublishTags, "--tag", "beta"]), ...commonBehaviors],
},
{
    name: "publish-v3nightly",
    distFolder,
    targets: [
        resolve("./packages/tsconfig.json"),
    ],
    behaviors: [PnPBuild(), PnPPackage(), PublishNightly([...commonPublishTags], "v3nightly"), ...commonBehaviors],
},
{
    name: "publish-v4nightly",
    distFolder,
    targets: [
        resolve("./packages/tsconfig.json"),
    ],
    behaviors: [PnPBuild(), PnPPackage(), PublishNightly([...commonPublishTags], "v4nightly"), ...commonBehaviors],
}];
