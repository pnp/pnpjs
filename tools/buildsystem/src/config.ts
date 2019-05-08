export interface BaseSchema {
    name: string;
    role: "build" | "package" | "publish";
}

// define build related types

export type BuildFunction = (version: string, config: BuildSchema, packages?: string[]) => Promise<void>;

export interface BuildTaskScoped {
    packages: string[];
    task: BuildFunction;
}

export type BuildTask = BuildFunction | BuildTaskScoped;

export interface BuildSchema extends BaseSchema {

    role: "build";

    packageRoot: string;

    preBuildTasks: BuildTask[];

    buildTargets: string[];

    postBuildTasks: BuildTask[];
}

// define package related types

export type PackageFunction = (version?: string, config?: PackageSchema, packages?: string[]) => Promise<void>;

export interface PackageTaskScoped {
    packages: string[];
    task: PackageFunction;
}

export interface PackageTargetMap {
    packageTarget: string;
    outDir: string;
}

export type PackageTask = PackageFunction | PackageTaskScoped;

export interface PackageSchema extends BaseSchema {

    role: "package";

    packageTargets: PackageTargetMap[];

    prePackageTasks: PackageTask[];

    packageTasks: PackageTask[];

    postPackageTasks: PackageTask[];
}

// define the publish types

export type PublishFunction = (version: string, config: PublishSchema, packages?: string[]) => Promise<void>;

export interface PublishTaskScoped {
    packages: string[];
    task: PublishFunction;
}

export type PublishTask = PublishFunction | PublishTaskScoped;

export interface PublishSchema extends BaseSchema {

    role: "publish";

    packageRoot: string;

    prePublishTasks: PublishTask[];

    publishTasks: PublishTask[];

    postPublishTasks: PublishTask[];
}

export type ValidConfigs = BuildSchema | PackageSchema | PublishSchema;

export type ConfigCollection = ValidConfigs[];
