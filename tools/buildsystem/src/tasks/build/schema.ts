import { BuildContext } from "./context";

export type BuildPackageFunction = (ctx: BuildContext) => Promise<void>;

export type BuildFunction = (version: string, config: BuildSchema) => Promise<void>;

export interface BuildInfo {
    name: string;
    buildPipeline?: BuildPackageFunction[];
    assets?: string[];
    configFile?: string;
}

export interface BuildSchema {
    /**
     * The path to the package root
     */
    packageRoot: string;

    /**
     * the list of packages to be built, in order
     */
    packages: (string | BuildInfo)[];

    /**
     * Set of tasks applied to the build once, not per package
     */
    tasks: BuildFunction[];

    /**
     * List of file paths relative to the packageRoot to be copied
     */
    assets: string[];

    /**
     * the set of tasks run on each project during a build, in order
     */
    buildPipeline: BuildPackageFunction[];

    /**
     * Allows the override of the tsconfig.json file name
     */
    configFile?: string;
}
