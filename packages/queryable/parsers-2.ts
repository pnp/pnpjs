import { Queryable2 } from "./queryable-2";
import { HttpRequestError } from "./parsers";
import { hOP } from "@pnp/common";
import { isFunc } from "@pnp/common";

export function DefaultParse(): (instance: Queryable2) => Queryable2 {

    return (instance: Queryable2) => {

        instance.on.parse(errorCheck, "replace");
        instance.on.parse(defaultParse);

        return instance;
    };
}

export function TextParse(): (instance: Queryable2) => Queryable2 {

    return parseBinder(r => r.text());
}

export function BlobParse(): (instance: Queryable2) => Queryable2 {

    return parseBinder(r => r.blob());
}

export function JSONParse(): (instance: Queryable2) => Queryable2 {

    return parseBinder(r => r.json());
}

export function BufferParse(): (instance: Queryable2) => Queryable2 {

    return parseBinder(r => isFunc(r.arrayBuffer) ? r.arrayBuffer() : (<any>r).buffer());
}

export async function errorCheck(url: string, response: Response, result: any): Promise<[string, Response, any]> {

    if (!response.ok) {
        // within these observers we just throw to indicate an unrecoverable error within the pipeline
        throw await HttpRequestError.init(response);
    }

    return [url, response, result];
}

export async function defaultParse(url: string, response: Response, result: any): Promise<[string, Response, any]> {

    // TODO:: only update result if not done?
    if (typeof result === "undefined") {

        if ((response.headers.has("Content-Length") && parseFloat(response.headers.get("Content-Length")) === 0) || response.status === 204) {

            result = {};
        } else {

            // patch to handle cases of 200 response with no or whitespace only bodies (#487 & #545)
            const txt = await response.text();
            const json = txt.replace(/\s/ig, "").length > 0 ? JSON.parse(txt) : {};
            result = parseODataJSON(json);
        }
    }

    return [url, response, result];
}

export function parseODataJSON(json: any): any {

    let result = json;

    if (hOP(json, "d")) {

        if (hOP(json.d, "results")) {

            result = json.d.results;

        } else {

            result = json.d;
        }
    } else if (hOP(json, "value")) {

        result = json.value;
    }

    return result;
}

function parseBinder(impl: (r: Response) => Promise<any>) {

    return (instance: Queryable2) => {

        instance.on.parse(errorCheck, "replace");
        instance.on.parse(async (url: string, response: Response, result: any): Promise<[string, Response, any]> => {

            result = await impl(response);

            return [url, response, result];
        });

        return instance;
    };
}
