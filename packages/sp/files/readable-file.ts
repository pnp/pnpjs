import { TimelinePipe } from "@pnp/core";
import {
    BlobParse,
    BufferParse,
    CacheNever,
    JSONParse,
    Queryable,
    TextParse,
    headers,
    parseBinderWithErrorCheck,
} from "@pnp/queryable";
import { _SPInstance, SPQueryable } from "../spqueryable.js";

export interface IResponseBodyStream {
    body: ReadableStream;
    knownLength: number;
}

export function StreamParse(): TimelinePipe<Queryable> {

    return parseBinderWithErrorCheck(async r => ({ body: r.body, knownLength: parseInt(r?.headers?.get("content-length") || "-1", 10) }));
}

export class ReadableFile<T = any> extends _SPInstance<T> {

    /**
     * Gets the contents of the file as text. Not supported in batching.
     *
     */
    public getText(): Promise<string> {
        return this.getParsed(TextParse());
    }

    /**
     * Gets the contents of the file as a blob, does not work in Node.js. Not supported in batching.
     *
     */
    public getBlob(): Promise<Blob> {
        return this.getParsed(BlobParse());
    }

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js. Not supported in batching.
     */
    public getBuffer(): Promise<ArrayBuffer> {
        return this.getParsed(BufferParse());
    }

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js. Not supported in batching.
     */
    public getJSON(): Promise<any> {
        return this.getParsed(JSONParse());
    }

    /**
     * Gets the content of a file as a ReadableStream
     *
     */
    public getStream(): Promise<IResponseBodyStream> {
        return SPQueryable(this, "$value").using(StreamParse(), CacheNever())(headers({ "binaryStringResponseBody": "true" }));
    }

    private getParsed<T>(parser: TimelinePipe): Promise<T> {
        return SPQueryable(this, "$value").using(parser, CacheNever())();
    }
}
