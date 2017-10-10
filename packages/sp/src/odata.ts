import { SharePointQueryableConstructor } from "./sharepointqueryable";
import { extractWebUrl } from "./utils/extractweburl";
import { Util } from "@pnp/common";
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

class SPODataEntityParserImpl<T> extends ODataParserBase<T> {

    constructor(protected factory: SharePointQueryableConstructor<T>) {
        super();
    }

    public hydrate = (d: any) => {
        const o = <T>new this.factory(spGetEntityUrl(d), null);
        return Util.extend(o, d);
    }

    public parse(r: Response): Promise<T> {
        return super.parse(r).then((d: any) => {
            const o = <T>new this.factory(spGetEntityUrl(d), null);
            return Util.extend(o, d);
        });
    }
}

class SPODataEntityArrayParserImpl<T> extends ODataParserBase<T[]> {

    constructor(protected factory: SharePointQueryableConstructor<T>) {
        super();
    }

    public hydrate = (d: any[]) => {
        return d.map(v => {
            const o = <T>new this.factory(spGetEntityUrl(v), null);
            return Util.extend(o, v);
        });
    }

    public parse(r: Response): Promise<T[]> {
        return super.parse(r).then((d: any[]) => {
            return d.map(v => {
                const o = <T>new this.factory(spGetEntityUrl(v), null);
                return Util.extend(o, v);
            });
        });
    }
}

export function spGetEntityUrl(entity: any): string {

    if (entity.hasOwnProperty("odata.metadata") && entity.hasOwnProperty("odata.editLink")) {
        // we are dealign with minimal metadata (default)
        return Util.combinePaths(extractWebUrl(entity["odata.metadata"]), "_api", entity["odata.editLink"]);
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

export function spODataEntity<T>(factory: SharePointQueryableConstructor<T>): ODataParser<T> {
    return new SPODataEntityParserImpl(factory);
}

export function spODataEntityArray<T>(factory: SharePointQueryableConstructor<T>): ODataParser<T[]> {
    return new SPODataEntityArrayParserImpl(factory);
}
