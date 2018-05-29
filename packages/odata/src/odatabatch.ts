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

    protected _dependencies: Promise<void>[];
    protected _requests: ODataBatchRequestInfo[];
    protected _resolveBatchDependencies: Promise<void>[];

    constructor(private _batchId = getGUID()) {
        this._requests = [];
        this._dependencies = [];
        this._resolveBatchDependencies = [];
    }

    public get batchId(): string {
        return this._batchId;
    }

    /**
     * The requests contained in this batch
     */
    protected get requests(): ODataBatchRequestInfo[] {
        return this._requests;
    }

    /**
     * 
     * @param url Request url
     * @param method Request method (GET, POST, etc)
     * @param options Any request options
     * @param parser The parser used to handle the eventual return from the query
     */
    public add<T>(url: string, method: string, options: FetchOptions, parser: ODataParser<T>, requestId: string): Promise<T> {

        const info: ODataBatchRequestInfo = {
            id: requestId,
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

        this._requests.push(info);

        return p;
    }

    /**
     * Adds a dependency insuring that some set of actions will occur before a batch is processed.
     * MUST be cleared using the returned resolve delegate to allow batches to run
     */
    public addDependency(): () => void {

        let resolver: () => void = () => void (0);
        const promise = new Promise<void>((resolve) => {
            resolver = resolve;
        });

        this._dependencies.push(promise);

        return resolver;
    }

    /**
     * The batch's execute method will not resolve util any promises added here resolve
     * 
     * @param p The dependent promise
     */
    public addResolveBatchDependency(p: Promise<any>): void {
        this._resolveBatchDependencies.push(p);
    }

    /**
     * Execute the current batch and resolve the associated promises
     *
     * @returns A promise which will be resolved once all of the batch's child promises have resolved
     */
    public execute(): Promise<void> {

        // we need to check the dependencies twice due to how different engines handle things.
        // We can get a second set of promises added during the first set resolving
        return Promise.all(this._dependencies)
            .then(() => Promise.all(this._dependencies))
            .then(() => this.executeImpl())
            .then(() => Promise.all(this._resolveBatchDependencies))
            .then(() => void (0));
    }

    protected abstract executeImpl(): Promise<void>;
}
