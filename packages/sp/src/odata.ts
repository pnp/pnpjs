import { SharePointQueryableConstructor } from "./sharepointqueryable";
import { extend, combinePaths } from "@pnp/common";
import { Logger, LogLevel } from "@pnp/logging";
import { ODataParser, ODataParserBase } from "@pnp/odata";
import { extractWebUrl } from "./utils/extractweburl";

export function spExtractODataId(candidate: any): string {

    if (candidate.hasOwnProperty("odata.metadata") && candidate.hasOwnProperty("odata.editLink")) {
        // we are dealign with minimal metadata (default)
        return combinePaths(extractWebUrl(candidate["odata.metadata"]), "_api", candidate["odata.editLink"]);
    } else if (candidate.hasOwnProperty("odata.editLink")) {
        return combinePaths("_api", candidate["odata.editLink"]);
    } else if (candidate.hasOwnProperty("__metadata")) {
        // we are dealing with verbose, which has an absolute uri
        return candidate.__metadata.uri;
    } else {
        // we are likely dealing with nometadata, so don't error but we won't be able to
        // chain off these objects
        Logger.write("No uri information found in ODataEntity parsing, chaining will fail for this object.", LogLevel.Warning);
        return "";
    }
}

class SPODataEntityParserImpl<T, D> extends ODataParserBase<T & D> {

    constructor(protected factory: SharePointQueryableConstructor<T>) {
        super();
    }

    public hydrate = (d: D) => {
        const o = <T>new this.factory(spExtractODataId(d), null);
        return extend(o, d);
    }

    public parse(r: Response): Promise<T & D> {
        return super.parse(r).then((d: any) => {
            const o = <T>new this.factory(spExtractODataId(d), null);
            return extend<T, D>(o, d);
        });
    }
}

class SPODataEntityArrayParserImpl<T, D> extends ODataParserBase<(T & D)[]> {

    constructor(protected factory: SharePointQueryableConstructor<T>) {
        super();
    }

    public hydrate = (d: D[]) => {
        return d.map(v => {
            const o = <T>new this.factory(spExtractODataId(v), null);
            return extend(o, v);
        });
    }

    public parse(r: Response): Promise<(T & D)[]> {
        return super.parse(r).then((d: D[]) => {
            return d.map(v => {
                const o = <T>new this.factory(spExtractODataId(v), null);
                return extend(o, v);
            });
        });
    }
}

export function spODataEntity<T, DataType = any>(factory: SharePointQueryableConstructor<T>): ODataParser<T & DataType> {
    return new SPODataEntityParserImpl<T, DataType>(factory);
}

export function spODataEntityArray<T, DataType = any>(factory: SharePointQueryableConstructor<T>): ODataParser<(T & DataType)[]> {
    return new SPODataEntityArrayParserImpl<T, DataType>(factory);
}
