import { SharePointQueryableConstructor } from "./sharepointqueryable";
import { extend, combinePaths } from "@pnp/common";
import { Logger, LogLevel } from "@pnp/logging";
import { ODataParser, ODataParserBase } from "@pnp/odata";
import { extractWebUrl } from "./utils/extractweburl";

export function spExtractODataId(candidate: any): string {

    const parts: string[] = [];

    if (candidate.hasOwnProperty("odata.type") && candidate["odata.type"] === "SP.Web") {
        // webs return an absolute url in the editLink
        if (candidate.hasOwnProperty("odata.editLink")) {
            parts.push(candidate["odata.editLink"]);
        } else if (candidate.hasOwnProperty("__metadata")) {
            // we are dealing with verbose, which has an absolute uri
            parts.push(candidate.__metadata.uri);
        }

    } else {

        if (candidate.hasOwnProperty("odata.metadata") && candidate.hasOwnProperty("odata.editLink")) {
            // we are dealign with minimal metadata (default)
            parts.push(extractWebUrl(candidate["odata.metadata"]), "_api", candidate["odata.editLink"]);
        } else if (candidate.hasOwnProperty("odata.editLink")) {
            parts.push("_api", candidate["odata.editLink"]);
        } else if (candidate.hasOwnProperty("__metadata")) {
            // we are dealing with verbose, which has an absolute uri
            parts.push(candidate.__metadata.uri);
        }
    }

    if (parts.length < 1) {
        Logger.write("No uri information found in ODataEntity parsing, chaining will fail for this object.", LogLevel.Warning);
        return "";
    }

    return combinePaths(...parts);
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
