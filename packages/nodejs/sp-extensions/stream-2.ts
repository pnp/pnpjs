import { getGUID, isFunc } from "@pnp/core/util";
import { extendFactory, headers } from "@pnp/queryable";
import { File, Files, IFileAddResult, IFileInfo, IFileUploadProgressData } from "@pnp/sp/files";
import { odataUrlFrom, spPost } from "@pnp/sp";
import { escapeQueryStrValue } from "@pnp/sp/utils/escapeQueryStrValue";
import { ReadStream } from "fs";
import { PassThrough } from "stream";
import { StreamParse } from "./stream.js";

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
     * @param chunkSize The size of each file chunks, in bytes (default: 10485760)
     */
    async setStreamContentChunked(stream: ReadStream, progress?: (data: IFileUploadProgressData) => void, chunkSize = 10485760): Promise<IFileAddResult> {
        if (!isFunc(progress)) {
            progress = () => null;
        }

        const uploadId = getGUID();
        let blockNumber = 1;
        let currentPointer = 0;
        // const fileSize = ??; // is unknown with a stream, should be receined and passed with fs.stats
        const fileSize: number = null;
        // const totalBlocks = parseInt((fileSize / chunkSize).toString(), 10) + ((fileSize % chunkSize === 0) ? 1 : 0);
        const totalBlocks: number = null;

        let chunkBuffer: Buffer = null;
        while (null !== (chunkBuffer = stream.read(chunkSize))) {
            if (currentPointer === 0) {
                progress({ uploadId, blockNumber, chunkSize, currentPointer, fileSize, stage: "starting", totalBlocks });
                await this.startUpload(uploadId, chunkBuffer);
            } else {
                progress({ uploadId, blockNumber, chunkSize, currentPointer, fileSize, stage: "continue", totalBlocks });
                await this.continueUpload(uploadId, currentPointer, chunkBuffer);
            }
            blockNumber += 1;
            currentPointer += chunkBuffer.length;
        }

        progress({ uploadId, blockNumber, chunkSize, currentPointer, fileSize, stage: "finishing", totalBlocks });
        return this.finishUpload(uploadId, currentPointer, Buffer.from([]));
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
    // 
    async addChunked(
        url: string,
        content: Blob | ReadStream,
        progress?: (data: IFileUploadProgressData) => void,
        shouldOverWrite = true,
        chunkSize = 10485760
    ): Promise<IFileAddResult> {

        const response: IFileInfo = await spPost(Files(this, `add(overwrite=${shouldOverWrite},url='${escapeQueryStrValue(url)}')`));
        const file = File(odataUrlFrom(response));

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
