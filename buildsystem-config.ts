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
    CreateResolutionPackageFiles,
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
const commonPublishTags = ["--access", "public", "--dry-run"];

function PnPBuild(buildFlags?: string[]): (b: BuildTimeline) => BuildTimeline {

    return (instance: BuildTimeline) => {

        Build(buildFlags)(instance);
        ReplaceVersion(["sp/behaviors/telemetry.js", "graph/behaviors/telemetry.js"], {})(instance);

        return instance;
    }
}

function PnPPackage(): (b: BuildTimeline) => BuildTimeline {

    return (instance: BuildTimeline) => {

        CopyPackageFiles("src", ["**/*.cjs"])(instance);
        CopyAssetFiles(".", ["LICENSE"])(instance);
        CopyAssetFiles("./packages", ["readme.md"])(instance);
        CopyPackageFiles("built", ["**/*.d.ts", "**/*.js", "**/*.js.map", "**/*.d.ts.map"])(instance);
        CreateResolutionPackageFiles()(instance),
        WritePackageJSON((p) => {
            return Object.assign({}, p, {
                type: "module",
                main: "./esm/index.js",
                typings: "./esm/index",
                engines: {
                    node: ">=18.12.0"
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
                },
                exports: {
                    ".": {
                        "import": {
                            "types": "./esm/index",
                            "default": "./esm/index.js"
                        },
                        "require": {
                            "types": "./commonjs/index",
                            "default": "./commonjs/index.js"
                        },
                        "default": "./esm/index.js"
                    }
                },
                maintainers: [
                    {
                        name: "patrick-rodgers",
                        email: "patrick.rodgers@microsoft.com"
                    },
                    {
                        name: "juliemturner",
                        email: "julie.turner@sympraxisconsulting.com",
                        url: "https://julieturner.net"
                    },
                    {
                        name: "bcameron1231",
                        email: "beau@beaucameron.net",
                        url: "https://beaucameron.net"
                    },
                ],
                funding: {
                    type: "individual",
                    url: "https://github.com/sponsors/patrick-rodgers/",
                },
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

export default <BuildSchema[]>[{
    name: "build",
    distFolder,
    targets: [
        resolve("./packages/tsconfig.json"),
        resolve("./packages/tsconfig-commonjs.json"),
    ],
    behaviors: [PnPBuild(), ...commonBehaviors],
},
{
    name: "build-debug",
    distFolder,
    targets: [
        resolve("./debug/launch/tsconfig.json"),
    ],
    behaviors: [Build(), ReplaceVersion(["packages/sp/behaviors/telemetry.js", "packages/graph/behaviors/telemetry.js"], {}), ...commonBehaviors],
},
{
    name: "package",
    distFolder,
    targets: [
        resolve("./packages/tsconfig.json"),
        resolve("./packages/tsconfig-commonjs.json"),
    ],
    behaviors: [PnPBuild(), PnPPackage(), ...commonBehaviors],
},
{
    name: "publish",
    distFolder,
    targets: [
        resolve("./packages/tsconfig.json"),
        resolve("./packages/tsconfig-commonjs.json"),
    ],
    behaviors: [PnPBuild(), PnPPackage(), PnPPublish(commonPublishTags), ...commonBehaviors],
},
{
    name: "publish-beta",
    distFolder,
    targets: [
        resolve("./packages/tsconfig.json"),
        resolve("./packages/tsconfig-commonjs.json"),
    ],
    behaviors: [PnPBuild(), PnPPackage(), PnPPublish([...commonPublishTags, "--tag", "beta"]), ...commonBehaviors],
},
{
    name: "publish-v4nightly",
    distFolder,
    targets: [
        resolve("./packages/tsconfig.json"),
        resolve("./packages/tsconfig-commonjs.json"),
    ],
    behaviors: [PnPBuild(), PnPPackage(), PublishNightly([...commonPublishTags], "v4nightly"), ...commonBehaviors],
}];
