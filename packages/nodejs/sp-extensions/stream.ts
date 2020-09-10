import { ODataParser, extendFactory, headers } from "@pnp/odata";
import { File } from "@pnp/sp/files";
import { PassThrough } from "stream";

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
});

declare module "@pnp/sp/files/types" {
    /**
     * Gets a PassThrough stream representing the file
     */
    interface IFile {
        getStream(): Promise<IResponseBodyStream>;
    }
}
