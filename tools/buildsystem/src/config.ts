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

export type PrePackageTask = () => Promise<void>;

export type PostPackageTask = () => Promise<void>;

export type PackageFunction = (target: PackageTargetMap, version?: string) => Promise<void>;

export type PackageTask = PackageFunction;

export interface PackageTargetMap {
    target: string;
    outDir: string;
    tasks: PackageTask[];
}

export interface PackageSchema extends BaseSchema {

    role: "package";

    prePackageTasks: PrePackageTask[];

    packageTargets: PackageTargetMap[];

    postPackageTasks: PostPackageTask[];
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

    packageRoots: string[];

    prePublishTasks: PublishTask[];

    publishTasks: PublishTask[];

    postPublishTasks: PublishTask[];
}

export type ValidConfigs = BuildSchema | PackageSchema | PublishSchema;

export type ConfigCollection = ValidConfigs[];
