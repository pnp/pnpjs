import { FetchOptions, getGUID } from "@pnp/common";
import { ODataParser } from "./parsers";

export interface ODataBatchRequestInfo {
    url: string;
    method: string;
    options: FetchOptions;
    parser: ODataParser<any>;
    resolve: ((d: any) => void) | null;
    reject: ((error: any) => void) | null;
    id: string;
}

export abstract class ODataBatch {

    protected _deps: Promise<void>[];
    protected _reqs: ODataBatchRequestInfo[];
    protected _rDeps: Promise<void>[];

    constructor(private _batchId = getGUID()) {
        this._reqs = [];
        this._deps = [];
        this._rDeps = [];
    }

    public get batchId(): string {
        return this._batchId;
    }

    /**
     * The requests contained in this batch
     */
    protected get requests(): ODataBatchRequestInfo[] {
        return this._reqs;
    }

    /**
     * 
     * @param url Request url
     * @param method Request method (GET, POST, etc)
     * @param options Any request options
     * @param parser The parser used to handle the eventual return from the query
     * @param id An identifier used to track a request within a batch
     */
    public add<T>(url: string, method: string, options: FetchOptions, parser: ODataParser<T>, id: string): Promise<T> {

        const info: ODataBatchRequestInfo = {
            id,
            method: method.toUpperCase(),
            options,
            parser,
            reject: null,
            resolve: null,
            url,
        };

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
