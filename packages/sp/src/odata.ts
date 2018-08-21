import { SharePointQueryableConstructor } from "./sharepointqueryable";
import { extend, combine, hOP } from "@pnp/common";
import { Logger, LogLevel } from "@pnp/logging";
import { ODataParser, ODataParserBase } from "@pnp/odata";
import { extractWebUrl } from "./utils/extractweburl";

export function odataUrlFrom(candidate: any): string {

    const parts: string[] = [];
    const s = ["odata.type", "odata.editLink", "__metadata", "odata.metadata"];
    if (hOP(candidate, s[0]) && candidate[s[0]] === "SP.Web") {
        // webs return an absolute url in the editLink
        if (hOP(candidate, s[1])) {
            parts.push(candidate[s[1]]);
        } else if (hOP(candidate, s[2])) {
            // we are dealing with verbose, which has an absolute uri
            parts.push(candidate.__metadata.uri);
        }

    } else {

        if (hOP(candidate, s[3]) && hOP(candidate, s[1])) {
            // we are dealign with minimal metadata (default)
            parts.push(extractWebUrl(candidate[s[3]]), "_api", candidate[s[1]]);
        } else if (hOP(candidate, s[1])) {
            parts.push("_api", candidate[s[1]]);
        } else if (hOP(candidate, s[2])) {
            // we are dealing with verbose, which has an absolute uri
            parts.push(candidate.__metadata.uri);
        }
    }

    if (parts.length < 1) {
        Logger.write("No uri information found in ODataEntity parsing, chaining will fail for this object.", LogLevel.Warning);
        return "";
    }

    return combine(...parts);
}

class SPODataEntityParserImpl<T, D> extends ODataParserBase<T & D> {

    constructor(protected factory: SharePointQueryableConstructor<T>) {
        super();
    }

    public hydrate = (d: D) => {
        const o = <T>new this.factory(odataUrlFrom(d), null);
        return extend(o, d);
    }

    public parse(r: Response): Promise<T & D> {
        return super.parse(r).then((d: any) => {
            const o = <T>new this.factory(odataUrlFrom(d), null);
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
            const o = <T>new this.factory(odataUrlFrom(v), null);
            return extend(o, v);
        });
    }

    public parse(r: Response): Promise<(T & D)[]> {
        return super.parse(r).then((d: D[]) => {
            return d.map(v => {
                const o = <T>new this.factory(odataUrlFrom(v), null);
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
