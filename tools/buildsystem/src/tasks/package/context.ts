/**
 * Defines the context object passed through the build pipeline
 */
export interface PackageContext {
    /**
     * The resolved path to the project folder
     */
    projectFolder: string;
    /**
     * The resolved path to the project file to build (tsconfig.json)
     */
    mainFile: string;
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
     * The contents of the package file from the source folder
     */
    pkgObj: any;
}
