export interface BaseSchema {
    name: string;
    role: "build" | "package" | "publish";
}
export declare type BuildFunction = (version: string, config: BuildSchema, packages?: string[]) => Promise<void>;
export interface BuildTaskScoped {
    packages: string[];
    task: BuildFunction;
}
export declare type BuildTask = BuildFunction | BuildTaskScoped;
export interface BuildSchema extends BaseSchema {
    role: "build";
    packageRoot: string;
    preBuildTasks: BuildTask[];
    buildTargets: string[];
    postBuildTasks: BuildTask[];
}
export declare type PackageFunction = (version?: string, config?: PackageSchema, packages?: string[]) => Promise<void>;
export interface PackageTaskScoped {
    packages: string[];
    task: PackageFunction;
}
export interface PackageTargetMap {
    packageTarget: string;
    outDir: string;
}
export declare type PackageTask = PackageFunction | PackageTaskScoped;
export interface PackageSchema extends BaseSchema {
    role: "package";
    packageTargets: PackageTargetMap[];
    prePackageTasks: PackageTask[];
    packageTasks: PackageTask[];
    postPackageTasks: PackageTask[];
}
export declare type PublishFunction = (version: string, config: PublishSchema, packages?: string[]) => Promise<void>;
export interface PublishTaskScoped {
    packages: string[];
    task: PublishFunction;
}
export declare type PublishTask = PublishFunction | PublishTaskScoped;
export interface PublishSchema extends BaseSchema {
    role: "publish";
    packageRoot: string;
    prePublishTasks: PublishTask[];
    publishTasks: PublishTask[];
    postPublishTasks: PublishTask[];
}
export declare type ValidConfigs = BuildSchema | PackageSchema | PublishSchema;
export declare type ConfigCollection = ValidConfigs[];
