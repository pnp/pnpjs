export interface BuildSchema {
    name: string;
    distFolder: string;
    targets: string[];
}

export interface TSConfig {
    compilerOptions: {
        outDir: string;
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
        }[];
    };
}
