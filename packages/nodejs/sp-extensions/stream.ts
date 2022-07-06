import { asCancelableScope, CancelAction, headers } from "@pnp/queryable";
import { File, Files, IFile, IFileAddResult, IFiles, IFileUploadProgressData } from "@pnp/sp/files/index.js";
import { spPost, escapeQueryStrValue } from "@pnp/sp";
import { ReadStream } from "fs";
import { PassThrough } from "stream";
import { extendFactory, getGUID, isFunc } from "@pnp/core";
import { StreamParse } from "../behaviors/stream-parse.js";
import { fileFromServerRelativePath } from "@pnp/sp/files/index.js";

export interface IResponseBodyStream {
    body: PassThrough;
    knownLength: number;
}

extendFactory(File, {

    getStream(): Promise<IResponseBodyStream> {
        return File(this, "$value").using(StreamParse())(headers({ "binaryStringResponseBody": "true" }));
    },

    /**
     * Sets the contents of a file using a chunked upload approach. Not supported in batching.
     *
     * @param stream The file to upload (as readable stream)
     * @param progress A callback function which can be used to track the progress of the upload
     */
    setStreamContentChunked: asCancelableScope(async function (this: IFile, stream: ReadStream, progress?: (data: IFileUploadProgressData) => void): Promise<IFileAddResult> {

        if (!isFunc(progress)) {
            progress = () => void (0);
        }

        const uploadId = getGUID();

        const fileRef = File(this).using(CancelAction(() => {
            return File(this).cancelUpload(uploadId);
        }));

        return new Promise((resolve) => {

            let blockNumber = -1;
            let promise = Promise.resolve(0);

            stream.on("data", (chunk) => {

                blockNumber += 1;

                if (blockNumber === 0) {

                    promise = promise.then(() => {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        progress!({ uploadId, blockNumber, chunkSize: chunk.length, currentPointer: 0, fileSize: -1, stage: "starting", totalBlocks: -1 });
                        return fileRef.startUpload(uploadId, <any>chunk);
                    });

                } else {

                    promise = promise.then((pointer) => {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        progress!({ uploadId, blockNumber, chunkSize: chunk.length, currentPointer: pointer, fileSize: -1, stage: "continue", totalBlocks: -1 });
                        return fileRef.continueUpload(uploadId, pointer, <any>chunk);
                    });

                }
            });

            stream.on("end", async () => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                progress!({ uploadId, blockNumber, chunkSize: -1, currentPointer: -1, fileSize: -1, stage: "finishing", totalBlocks: -1 });
                promise.then((pointer) => {
                    return resolve(fileRef.finishUpload(uploadId, pointer, Buffer.from([])));
                });
            });
        });
    }),
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
    addChunked: asCancelableScope(async function (
        this: IFiles,
        url: string,
        content: Blob | ReadStream,
        progress?: (data: IFileUploadProgressData) => void,
        shouldOverWrite = true,
        chunkSize = 10485760
    ) {

        const response = await spPost(Files(this, `add(overwrite=${shouldOverWrite},url='${escapeQueryStrValue(url)}')`));

        const file = fileFromServerRelativePath(this, response.ServerRelativeUrl);

        file.using(CancelAction(async () => {
            return File(file).delete();
        }));

        if ("function" === typeof (content as ReadStream).read) {
            return file.setStreamContentChunked(content as ReadStream, progress);
        }

        return file.setContentChunked(content as Blob, progress, chunkSize);
    }),
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
            chunkSize?: number,
        ): Promise<IFileAddResult>;
    }
}
