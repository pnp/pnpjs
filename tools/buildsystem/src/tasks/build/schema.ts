export type BuildFunction = (version: string, config: BuildSchema, packages?: string[]) => Promise<void>;

export interface BuildTaskScoped {
    packages: string[];
    task: BuildFunction;
}

export type BuildTask = BuildFunction | BuildTaskScoped;

export interface BuildSchema {

    packageRoot: string;

    preBuildTasks: BuildTask[];

    buildTargets: string[];

    postBuildTasks: BuildTask[];
}
