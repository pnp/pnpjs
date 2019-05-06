export type PackageFunction = (version: string, config: PackageSchema, packages?: string[]) => Promise<void>;

export interface PackageTaskScoped {
    packages: string[];
    task: PackageFunction;
}

export interface PackageTargetMap {
    packageTarget: string;
    outDir: string;
}

export type PackageTask = PackageFunction | PackageTaskScoped;

export interface PackageSchema {

    packageTargets: PackageTargetMap[];

    prePackageTasks: PackageTask[];

    packageTasks: PackageTask[];

    postPackageTasks: PackageTask[];
}
