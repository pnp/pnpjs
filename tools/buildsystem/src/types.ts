import { TimelinePipe } from "@pnp/core";
import { BuildObserver } from "./build-timeline.js";

export interface BuildSchema {
    name: string;
    distFolder: string;
    targets: string[];
    behaviors?: TimelinePipe[];
    preBuild?: BuildObserver[];
    build?: BuildObserver[];
    postBuild?: BuildObserver[];
    prePackage?: BuildObserver[];
    package?: BuildObserver[];
    postPackage?: BuildObserver[];
    prePublish?: BuildObserver[];
    publish?: BuildObserver[];
    postPublish?: BuildObserver[];
}

export interface TSConfig {
    compilerOptions: {
        outDir: string;
        module: string;
    };
    references?: {
        path: string;
    }[];
}

export interface IBuildContext {
    buildId: string;
    resolvedProjectRoot: string;
    version: string;
    configName: string;
    distRoot: string;
    target: {
        tsconfigPath: string;
        tsconfigRoot: string;
        parsedTSConfig: TSConfig;
        resolvedOutDir: string;
        packages: {
            name: string;
            resolvedPkgSrcTSConfigPath: string;
            resolvedPkgSrcRoot: string;
            resolvedPkgOutRoot: string;
            resolvedPkgDistRoot: string;
            relativePkgDistModulePath: string;
        }[];
    };
}
