import { IFetchOptions, getGUID } from "@pnp/common";
import { IODataParser } from "./parsers";
import { IQueryable } from "./queryable";
import { IRequestContext } from "./pipeline";

export interface IODataBatchRequestInfo {
    url: string;
    method: string;
    options: IFetchOptions;
    parser: IODataParser<any>;
    resolve: ((d: any) => void) | null;
    reject: ((error: any) => void) | null;
    id: string;
    index: number;
}

export abstract class Batch {

    protected _deps: Promise<void>[];
    protected _reqs: IODataBatchRequestInfo[];
    protected _rDeps: Promise<void>[];
    private _index: number;

    constructor(private _batchId = getGUID()) {
        this._reqs = [];
        this._deps = [];
        this._rDeps = [];
        this._index = -1;
    }

    public get batchId(): string {
        return this._batchId;
    }

    /**
     * The requests contained in this batch
     */
    protected get requests(): IODataBatchRequestInfo[] {
        // we sort these each time this is accessed
        return this._reqs.sort((info1, info2) => info1.index - info2.index);
    }

    /**
     * Not meant for use directly
     * 
     * @param batchee The IQueryable for this batch to track in order
     */
    public track(batchee: IQueryable<any>): void {

        batchee.data.batch = this;

        // we need to track the order requests are added to the batch to ensure we always
        // operate on them in order
        if (typeof batchee.data.batchIndex === "undefined" || batchee.data.batchIndex < 0) {
            batchee.data.batchIndex = ++this._index;
        }
    }

    /**
     * Adds the given request context to the batch for execution
     * 
     * @param context Details of the request to batch
     */
    public add<T = any>(context: IRequestContext<T>): Promise<T> {

        const info: IODataBatchRequestInfo = {
            id: context.requestId,
            index: context.batchIndex,
            method: context.method.toUpperCase(),
            options: context.options,
            parser: context.parser,
            reject: null,
            resolve: null,
            url: context.url,
        };

        // we create a new promise that will be resolved within the batch
        const p = new Promise<T>((resolve, reject) => {
            info.resolve = resolve;
            info.reject = reject;
        });

        this._reqs.push(info);

        return p;
    }

    /**
     * Adds a dependency insuring that some set of actions will occur before a batch is processed.
     * MUST be cleared using the returned resolve delegate to allow batches to run
     */
    public addDependency(): () => void {

        let resolver: () => void = () => void (0);

        this._deps.push(new Promise<void>((resolve) => {
            resolver = resolve;
        }));

        return resolver;
    }

    /**
     * The batch's execute method will not resolve util any promises added here resolve
     * 
     * @param p The dependent promise
     */
    public addResolveBatchDependency(p: Promise<any>): void {
        this._rDeps.push(p);
    }

    /**
     * Execute the current batch and resolve the associated promises
     *
     * @returns A promise which will be resolved once all of the batch's child promises have resolved
     */
    public execute(): Promise<void> {

        // we need to check the dependencies twice due to how different engines handle things.
        // We can get a second set of promises added during the first set resolving
        return Promise.all(this._deps)
            .then(() => Promise.all(this._deps))
            .then(() => this.executeImpl())
            .then(() => Promise.all(this._rDeps))
            .then(() => void (0));
    }

    protected abstract executeImpl(): Promise<void>;
}
