import { PackageContext } from "./context";

export type PackageTaskFunction = (ctx: PackageContext) => Promise<void>;

export interface PackageInfo {
    name: string;
    packagePipeline?: PackageTaskFunction[];
    assets?: string[];
}

export interface PackageSchema {

    /**
     * The directory to which packages will be written
     */
    outDir: string;

    /**
     * The path to the package root
     */
    packageRoot: string;

    /**
     * the list of packages to be built, in order
     */
    packages: (string | PackageInfo)[];

    /**
     * List of file paths relative to the packageRoot to be copied
     */
    assets: string[];

    /**
     * the set of tasks run on each project during a build, in order
     */
    packagePipeline: PackageTaskFunction[];
}
