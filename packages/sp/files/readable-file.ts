import { TimelinePipe } from "@pnp/core";
import { BlobParse, BufferParse, CacheNever, JSONParse, TextParse } from "@pnp/queryable/index.js";
import { _SPInstance, SPQueryable } from "../spqueryable.js";

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

    private getParsed<T>(parser: TimelinePipe): Promise<T> {
        return SPQueryable(this, "$value").using(parser, CacheNever())();
    }
}
