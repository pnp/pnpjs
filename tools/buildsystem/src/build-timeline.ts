import { ObserverFunction, Timeline, getGUID } from "@pnp/core";
import { IBuildContext } from "./types.js";

export type BuildObserver = (this: any) => Promise<void>;

export function asyncReduceVoid<T extends ObserverFunction<void>>(): (observers: T[]) => Promise<void> {

    return async function (this: Timeline<any>, observers: T[]): Promise<void> {
        const obs = [...observers];
        return obs.reduce((prom, func: T) => prom.then(() => Reflect.apply(func, this, [])), Promise.resolve());
    };
}

export const BuildMoments = {
    preBuild: asyncReduceVoid<BuildObserver>(),
    build: asyncReduceVoid<BuildObserver>(),
    postBuild: asyncReduceVoid<BuildObserver>(),
    prePackage: asyncReduceVoid<BuildObserver>(),
    package: asyncReduceVoid<BuildObserver>(),
    postPackage: asyncReduceVoid<BuildObserver>(),
    prePublish: asyncReduceVoid<BuildObserver>(),
    publish: asyncReduceVoid<BuildObserver>(),
    postPublish: asyncReduceVoid<BuildObserver>(),
} as const;

export class BuildTimeline extends Timeline<typeof BuildMoments> {

    protected InternalResolve = Symbol.for("Queryable_Resolve");
    protected InternalReject = Symbol.for("Queryable_Reject");

    constructor(templateTimeline?: BuildTimeline, protected context?: Partial<IBuildContext>) {
        super(BuildMoments);

        if (typeof templateTimeline !== "undefined") {
            this.observers = templateTimeline.observers;
            this._inheritingObservers = true;
        }
    }

    public start(): Promise<void> {
        return this.execute();
    }

    protected execute(): Promise<void> {

        // if there are NO observers registered this is likely either a bug in the library or a user error, direct to docs
        if (Reflect.ownKeys(this.observers).length < 1) {
            throw Error("No observers registered for this request. (https://pnp.github.io/pnpjs/queryable/queryable#no-observers-registered-for-this-request)");
        }

        // // schedule the execution after we return the promise below in the next event loop
        setTimeout(async () => {

            try {

                const { context } = this;
                context.buildId = getGUID();

                await this.emit.preBuild();
                await this.emit.build();
                await this.emit.postBuild();

                await this.emit.prePackage();
                await this.emit.package();
                await this.emit.postPackage();

                await this.emit.prePublish();
                await this.emit.publish();
                await this.emit.postPublish();

                this.emit[this.InternalResolve]();

            } catch (e) {

                this.emit[this.InternalReject](e);
            }

        }, 0);

        // // this is the promise that the calling code will recieve and await
        let promise = new Promise<void>((resolve, reject) => {

            // we overwrite any pre-existing internal events as a
            // given queryable only processes a single request at a time
            this.on[this.InternalResolve].replace(resolve);
            this.on[this.InternalReject].replace(reject);
        });

        return promise;
    }
}
