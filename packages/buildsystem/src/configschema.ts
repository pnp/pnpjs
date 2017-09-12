import { TaskFunction } from "./tasks";

export interface PackageInfo {
    name: string;
    buildChain?: TaskFunction[];
    assets?: string[];
}

export interface ConfigSchema {

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
    buildChain: TaskFunction[];
}
