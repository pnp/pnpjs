import { ODataParser } from "./parsers";
import { getGUID, FetchOptions } from "@pnp/common";

export interface ODataBatchRequestInfo {
    url: string;
    method: string;
    options: FetchOptions;
    parser: ODataParser<any>;
    resolve: ((d: any) => void) | null;
    reject: ((error: any) => void) | null;
}

export abstract class ODataBatch {

    protected _dependencies: Promise<void>[];
    protected _requests: ODataBatchRequestInfo[];

    constructor(private _batchId = getGUID()) {
        this._requests = [];
        this._dependencies = [];
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
    public add<T>(url: string, method: string, options: FetchOptions, parser: ODataParser<T>): Promise<T> {

        const info: ODataBatchRequestInfo = {
            method: method.toUpperCase(),
            options: options,
            parser: parser,
            reject: null,
            resolve: null,
            url: url,
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
     * Execute the current batch and resolve the associated promises
     *
     * @returns A promise which will be resolved once all of the batch's child promises have resolved
     */
    public execute(): Promise<void> {

        // we need to check the dependencies twice due to how different engines handle things.
        // We can get a second set of promises added during the first set resolving
        return Promise.all(this._dependencies).then(() => Promise.all(this._dependencies)).then(() => this.executeImpl());
    }

    protected abstract executeImpl(): Promise<void>;
}
