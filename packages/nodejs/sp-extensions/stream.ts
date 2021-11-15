import { getGUID, isFunc, stringIsNullOrEmpty } from "@pnp/common";
import { ODataParser, extendFactory, headers } from "@pnp/odata";
import { File, Files, IFileAddResult, IFileInfo, IFileUploadProgressData, IFiles } from "@pnp/sp/files/index.js";
import { spPost, odataUrlFrom, escapeQueryStrValue } from "@pnp/sp";
import { ReadStream } from "fs";
import { PassThrough } from "stream";
import { _File } from "@pnp/sp/files/types.js";

export interface IResponseBodyStream {
    body: PassThrough;
    knownLength: number;
}

export class StreamParser extends ODataParser<IResponseBodyStream> {

    protected parseImpl(r: Response, resolve: (value: any) => void): void {
        resolve({ body: r.body, knownLength: parseInt(r.headers.get("content-length"), 10) });
    }
}

extendFactory(File, {

    getStream(): Promise<IResponseBodyStream> {
        return this.clone(File, "$value", false).usingParser(new StreamParser())(headers({ "binaryStringResponseBody": "true" }));
    },

    /**
     * Sets the contents of a file using a chunked upload approach. Not supported in batching.
     *
     * @param stream The file to upload (as readable stream)
     * @param progress A callback function which can be used to track the progress of the upload
     * @param chunkSize The size of each file chunks, in bytes (default: 10485760)
     */
    async setStreamContentChunked(this: _File, stream: ReadStream, progress?: (data: IFileUploadProgressData) => void): Promise<IFileAddResult> {

        if (!isFunc(progress)) {
            progress = () => null;
        }

        const uploadId = getGUID();
        let blockNumber = -1;
        let promise = Promise.resolve(0);

        return new Promise((resolve) => {

            stream.on("data", (chunk) => {

                blockNumber += 1;

                if (blockNumber === 0) {

                    promise = promise.then(() => {
                        progress({ uploadId, blockNumber, chunkSize: chunk.length, currentPointer: 0, fileSize: -1, stage: "starting", totalBlocks: -1 });
                        return File(this).startUpload(uploadId, <any>chunk);
                    });
                } else {

                    promise = promise.then((cp) => {
                        progress({ uploadId, blockNumber, chunkSize: chunk.length, currentPointer: cp, fileSize: -1, stage: "continue", totalBlocks: -1 });
                        return File(this).continueUpload(uploadId, cp, <any>chunk);
                    });
                }
            });

            stream.on("end", async () => {
                progress({ uploadId, blockNumber, chunkSize: -1, currentPointer: -1, fileSize: -1, stage: "finishing", totalBlocks: -1 });
                promise.then((cp) => resolve(File(this).finishUpload(uploadId, cp, Buffer.from([]))));
            });
        });
    },
});

extendFactory(Files, {

    /**
     * Uploads a file. Not supported for batching
     *
     * @param url The folder-relative url of the file
     * @param content The Blob file content or File readable stream to add
     * @param progress A callback function which can be used to track the progress of the upload
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten? (default: true)
     * @param chunkSize The size of each file slice, in bytes (default: 10485760)
     * @returns The new File and the raw response.
     */
    // @tag("fis.addChunked")
    async addChunked(
        this: IFiles,
        url: string,
        content: Blob | ReadStream,
        progress?: (data: IFileUploadProgressData) => void,
        shouldOverWrite = true,
        chunkSize = 10485760
    ): Promise<IFileAddResult> {

        const response: IFileInfo = await spPost(this.clone(Files, `add(overwrite=${shouldOverWrite},url='${escapeQueryStrValue(url)}')`, false));
        let odataUrl = odataUrlFrom(response);
        if (!stringIsNullOrEmpty(odataUrl) && /%27/i.test(odataUrl)) {
            odataUrl = odataUrl.replace(/%27/ig, "''");
        }
        const file = File(odataUrl);

        if ("function" === typeof (content as ReadStream).read) {
            return file.setStreamContentChunked(content as ReadStream, progress, chunkSize);
        }

        return file.setContentChunked(content as Blob, progress, chunkSize);
    },
});

declare module "@pnp/sp/files/types" {

    interface IFile {
        /**
         * Gets a PassThrough stream representing the file
         */
        getStream(): Promise<IResponseBodyStream>;

        /**
         * Sets a file stream content chunk
         */
        setStreamContentChunked(
            stream: ReadStream,
            progress?: (data: IFileUploadProgressData) => void,
            chunkSize?: number
        ): Promise<IFileAddResult>;
    }

    interface IFiles {
        /**
         * Adds a file stream in chunks
         */
        addChunked(
            url: string,
            content: Blob | ReadStream,
            progress?: (data: IFileUploadProgressData) => void,
            shouldOverWrite?: boolean,
            chunkSize?: number
        ): Promise<IFileAddResult>;
    }
}
