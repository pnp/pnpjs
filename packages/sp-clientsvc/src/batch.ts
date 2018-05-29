import { LogLevel, Logger } from "@pnp/logging";
import { CachingParserWrapper, ODataBatch, ODataBatchRequestInfo } from "@pnp/odata";
import { ClientSvcQueryable } from "./clintsvcqueryable";
import { ObjectPath, ObjectPathQueue, opSetId, opSetParentId, opSetPathId, opSetPathParamId } from "./objectpath";
import { objectPath } from "./opactionbuilders";
import { staticMethod } from "./opbuilders";
import { ProcessQueryParser } from "./parsers";
import { writeObjectPathBody } from "./utils";

export interface IObjectPathBatch extends ODataBatch {

}

/**
 * Implements ODataBatch for use with the ObjectPath framework
 */
export class ObjectPathBatch extends ODataBatch implements IObjectPathBatch {

    constructor(protected parentUrl: string, _batchId?: string) {
        super(_batchId);
    }

    protected executeImpl(): Promise<void> {

        // if we don't have any requests, don't bother sending anything
        // this could be due to caching further upstream, or just an empty batch
        if (this.requests.length < 1) {
            Logger.write(`Resolving empty batch.`, LogLevel.Info);
            return Promise.resolve();
        }

        const executor = new BatchExecutor(this.parentUrl, this.batchId);
        executor.appendRequests(this.requests);
        return executor.execute();
    }
}

class BatchExecutor extends ClientSvcQueryable {

    private _builderIndex: number;
    private _requests: ODataBatchRequestInfo[];

    constructor(parentUrl: string, public batchId: string) {
        super(parentUrl);

        this._requests = [];
        this._builderIndex = 1;

        // we add our session object path and hard code in the IDs so we can reference it
        const method = staticMethod("GetTaxonomySession", "{981cbc68-9edc-4f8d-872f-71146fcbb84f}");
        method.path = opSetId("0", method.path);
        method.actions.push(opSetId("1", opSetPathId("0", objectPath())));

        this._objectPaths.add(method);
    }

    public appendRequests(requests: ODataBatchRequestInfo[]): void {

        requests.forEach(request => {

            // grab the special property we added to options when we created the batch info
            const pathQueue: ObjectPathQueue = (<any>request.options).clientsvc_ObjectPaths;

            let paths = pathQueue.toArray();

            // getChildRelationships
            if (paths.length < 0) {
                return;
            }

            let indexMappingFunction = (n: number) => n;

            if (/GetTaxonomySession/i.test(paths[0].path)) {

                // drop the first thing as it is a get session object path, which we add once for the entire batch
                paths = paths.slice(1);

                // replace the next item's parent id with 0, which will be the id of the session call at the root of this request
                paths[0].path = opSetParentId("0", paths[0].path);

                indexMappingFunction = (n: number) => n - 1;
            }

            let lastOpId = -1;
            const idIndexMap: number[] = [];

            paths.map((op, index, arr) => {

                // rewrite the path string
                const opId = ++this._builderIndex;

                // track the array index => opId relationship
                idIndexMap.push(opId);

                let path = opSetPathParamId(idIndexMap, opSetId(opId.toString(), op.path), indexMappingFunction);
                if (lastOpId >= 0) {
                    path = opSetParentId(lastOpId.toString(), path);
                }

                // rewrite actions with placeholders replaced
                const opActions = op.actions.map(a => {
                    const actionId = ++this._builderIndex;
                    return opSetId(actionId.toString(), opSetPathId(opId.toString(), a));
                });

                // handle any specific child relationships
                // the childIndex is reduced by 1 because we are removing the Session Path
                pathQueue.getChildRelationship(index + 1).map(i => i - 1).forEach(childIndex => {
                    // set the parent id for our non-immediate children
                    arr[childIndex].path = opSetParentId(opId.toString(), arr[childIndex].path);
                });

                // and remember our last object path id for the parent replace above
                lastOpId = opId;

                // return our now substituted path and actions as a new object path instance
                return new ObjectPath(path, opActions);

            }).forEach(op => this._objectPaths.add(op));

            // get this once
            const obPaths = this._objectPaths.toArray();

            // create a new parser to handle finding the result based on the path
            const parser = new ProcessQueryParser(obPaths[obPaths.length - 1]);

            if (request.parser instanceof CachingParserWrapper) {
                // handle special case of caching
                request.parser = new ProcessQueryCachingParserWrapper(parser, request.parser);
            } else {
                request.parser = parser;
            }

            // add the request to our batch requests
            this._requests.push(request);

            // remove the temp property
            delete (<any>request.options).clientsvc_ObjectPaths;
        });
    }

    public execute(): Promise<void> {

        Logger.write(`[${this.batchId}] (${(new Date()).getTime()}) Executing batch with ${this._requests.length} requests.`, LogLevel.Info);

        // create our request body from all the merged object paths
        const options = {
            body: writeObjectPathBody(this._objectPaths.toArray()),
        };

        Logger.write(`[${this.batchId}] (${(new Date()).getTime()}) Sending batch request.`, LogLevel.Info);

        // send the batch
        return super.postCore(options, new BatchParser()).then((rawResponse: any) => {

            Logger.write(`[${this.batchId}] (${(new Date()).getTime()}) Resolving batched requests.`, LogLevel.Info);

            return this._requests.reduce((chain, request) => {

                Logger.write(`[${request.id}] (${(new Date()).getTime()}) Resolving request in batch ${this.batchId}.`, LogLevel.Info);

                return chain.then(_ => (<ProcessQueryParser>request.parser).findResult(rawResponse).then(request.resolve).catch(request.reject));

            }, Promise.resolve());
        });
    }
}

/**
 * Used to return the raw results from parsing the batch
 */
class BatchParser<T = any> extends ProcessQueryParser<T> {

    constructor() {
        super(null);
    }

    public findResult(json: any): Promise<T> {
        // we leave it to the individual request parsers to find their results in the raw json body
        return json;
    }
}

/**
 * Handles processing batched results that are also cached
 */
class ProcessQueryCachingParserWrapper<T> extends CachingParserWrapper<T> {

    constructor(parser: ProcessQueryParser, wrapper: CachingParserWrapper<T>) {
        super(parser, wrapper.cacheOptions);
    }

    public findResult(json: any): Promise<T> {
        return (<any>this.parser).findResult(json).then((d: any) => this.cacheData(d));
    }
}
