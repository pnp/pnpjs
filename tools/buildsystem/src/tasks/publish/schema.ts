import { PublishContext } from "./context";

export type PublishTaskFunction = (ctx: PublishContext) => Promise<void>;

export interface PublishInfo {
    name: string;
    publishPipeline?: PublishTaskFunction[];
}

export interface PublishSchema {

    /**
     * The path to the package root
     */
    packageRoot: string;

    /**
     * the list of packages to be built, in order
     */
    packages: (string | PublishInfo)[];

    /**
     * the set of tasks run on each project during a build, in order
     */
    publishPipeline: PublishTaskFunction[];
}
