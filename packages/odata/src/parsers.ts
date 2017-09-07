import { ODataParser, ODataParserBase } from "./core";
import { Util } from "@pnp/common";

export class ODataDefaultParser extends ODataParserBase<any> {
}

class ODataValueParserImpl<T> extends ODataParserBase<T> {
    public parse(r: Response): Promise<T> {
        return super.parse(r).then(d => d as T);
    }
}

export function ODataValue<T>(): ODataParser<T> {
    return new ODataValueParserImpl<T>();
}

export class ODataRawParserImpl implements ODataParser<any> {
    public parse(r: Response): Promise<any> {
        return r.json();
    }
}

export let ODataRaw = new ODataRawParserImpl();

export class TextFileParser implements ODataParser<string> {

    public parse(r: Response): Promise<string> {
        return r.text();
    }
}

export class BlobFileParser implements ODataParser<Blob> {

    public parse(r: Response): Promise<Blob> {
        return r.blob();
    }
}

export class JSONFileParser implements ODataParser<any> {

    public parse(r: Response): Promise<any> {
        return r.json();
    }
}

export class BufferFileParser implements ODataParser<ArrayBuffer> {

    public parse(r: any): Promise<ArrayBuffer> {

        if (Util.isFunction(r.arrayBuffer)) {
            return r.arrayBuffer();
        }

        return r.buffer();
    }
}
