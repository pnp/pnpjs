/**
 * Defines the context object passed through the build pipeline
 */
export interface BuildContext {
    /**
     * The resolved path to the project folder
     */
    projectFolder: string;
    /**
     * The resolved path to the project file to build (tsconfig.json)
     */
    projectFile: string;
    /**
     * The tsconfig file ready into a JSON object
     */
    tsconfigObj: any;
    /**
     * The resolved path to the target folder for the build output
     */
    targetFolder: string;
    /**
     * The package name being built
     */
    name: string;

    /**
     * The set of asset paths, relative to projectFolder that should be copied to targetFolder
     */
    assets: string[];

    /**
     * The version string to be written into all built packages' package.json files
     */
    version: string;
}
