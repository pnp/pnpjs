export type PublishFunction = (version: string, config: PublishSchema, packages?: string[]) => Promise<void>;

export interface PublishTaskScoped {
    packages: string[];
    task: PublishFunction;
}

export type PublishTask = PublishFunction | PublishTaskScoped;

export interface PublishSchema {

    packageRoot: string;

    prePublishTasks: PublishTask[];

    publishTasks: PublishTask[];

    postPublishTasks: PublishTask[];
}
