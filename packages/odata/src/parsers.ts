import { ODataParser, ODataParserBase } from "./core";
import { Util } from "@pnp/common";

export class ODataDefaultParser extends ODataParserBase<any> {
}

export class TextParser implements ODataParser<string> {

    public parse(r: Response): Promise<string> {
        return r.text();
    }
}

export class BlobParser implements ODataParser<Blob> {

    public parse(r: Response): Promise<Blob> {
        return r.blob();
    }
}

export class JSONParser implements ODataParser<any> {

    public parse(r: Response): Promise<any> {
        return r.json();
    }
}

export class BufferParser implements ODataParser<ArrayBuffer> {

    public parse(r: any): Promise<ArrayBuffer> {

        if (Util.isFunc(r.arrayBuffer)) {
            return r.arrayBuffer();
        }

        return r.buffer();
    }
}
