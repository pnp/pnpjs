/**
 * Defines the context object passed through the build pipeline
 */
export interface PublishContext {
    /**
     * The resolved path to the project folder
     */
    packageFolder: string;
    /**
     * The package name being built
     */
    name: string;
    /**
     * The contents of the package file from the source folder
     */
    pkgObj: any;
}
