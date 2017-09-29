import { BuildContext } from "./context";

export type BuildTaskFunction = (ctx: BuildContext) => Promise<void>;

export interface BuildInfo {
    name: string;
    buildPipeline?: BuildTaskFunction[];
    assets?: string[];
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
     * List of file paths relative to the packageRoot to be copied
     */
    assets: string[];

    /**
     * the set of tasks run on each project during a build, in order
     */
    buildPipeline: BuildTaskFunction[];
}
