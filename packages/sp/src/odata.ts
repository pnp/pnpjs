import { SharePointQueryableConstructor } from "./sharepointqueryable";
import { extractWebUrl } from "./utils/extractweburl";
import { extend, combinePaths } from "@pnp/common";
import { Logger, LogLevel } from "@pnp/logging";
import { SPODataIdException } from "./exceptions";
import { ODataParser, ODataParserBase } from "@pnp/odata";

export function spExtractODataId(candidate: any): string {

    if (candidate.hasOwnProperty("odata.id")) {
        return candidate["odata.id"];
    } else if (candidate.hasOwnProperty("__metadata") && candidate.__metadata.hasOwnProperty("id")) {
        return candidate.__metadata.id;
    } else {
        throw new SPODataIdException(candidate);
    }
}

class SPODataEntityParserImpl<T, D> extends ODataParserBase<T & D> {

    constructor(protected factory: SharePointQueryableConstructor<T>) {
        super();
    }

    public hydrate = (d: D) => {
        const o = <T>new this.factory(spGetEntityUrl(d), null);
        return extend(o, d);
    }

    public parse(r: Response): Promise<T & D> {
        return super.parse(r).then((d: any) => {
            const o = <T>new this.factory(spGetEntityUrl(d), null);
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
            const o = <T>new this.factory(spGetEntityUrl(v), null);
            return extend(o, v);
        });
    }

    public parse(r: Response): Promise<(T & D)[]> {
        return super.parse(r).then((d: D[]) => {
            return d.map(v => {
                const o = <T>new this.factory(spGetEntityUrl(v), null);
                return extend(o, v);
            });
        });
    }
}

export function spGetEntityUrl(entity: any): string {

    if (entity.hasOwnProperty("odata.metadata") && entity.hasOwnProperty("odata.editLink")) {
        // we are dealign with minimal metadata (default)
        return combinePaths(extractWebUrl(entity["odata.metadata"]), "_api", entity["odata.editLink"]);
    } else if (entity.hasOwnProperty("odata.editLink")) {
        return entity["odata.editLink"];
    } else if (entity.hasOwnProperty("__metadata")) {
        // we are dealing with verbose, which has an absolute uri
        return entity.__metadata.uri;
    } else {
        // we are likely dealing with nometadata, so don't error but we won't be able to
        // chain off these objects
        Logger.write("No uri information found in ODataEntity parsing, chaining will fail for this object.", LogLevel.Warning);
        return "";
    }
}

export function spODataEntity<T, DataType = any>(factory: SharePointQueryableConstructor<T>): ODataParser<T & DataType> {
    return new SPODataEntityParserImpl<T, DataType>(factory);
}

export function spODataEntityArray<T, DataType = any>(factory: SharePointQueryableConstructor<T>): ODataParser<(T & DataType)[]> {
    return new SPODataEntityArrayParserImpl<T, DataType>(factory);
}
