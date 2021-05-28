import { Queryable2 } from "./queryable-2";
import { HttpRequestError } from "./parsers";
import { hOP } from "@pnp/common";
import { isFunc } from "@pnp/common";

export function DefaultParse(): (instance: Queryable2) => Queryable2 {

    return parseBinderWithErrorCheck(async (response) => {

        if ((response.headers.has("Content-Length") && parseFloat(response.headers.get("Content-Length")) === 0) || response.status === 204) {

            return {};
        }

        // patch to handle cases of 200 response with no or whitespace only bodies (#487 & #545)
        const txt = await response.text();
        const json = txt.replace(/\s/ig, "").length > 0 ? JSON.parse(txt) : {};
        return parseODataJSON(json);
    });
}

export function TextParse(): (instance: Queryable2) => Queryable2 {

    return parseBinderWithErrorCheck(r => r.text());
}

export function BlobParse(): (instance: Queryable2) => Queryable2 {

    return parseBinderWithErrorCheck(r => r.blob());
}

export function JSONParse(): (instance: Queryable2) => Queryable2 {

    return parseBinderWithErrorCheck(r => r.json());
}

export function BufferParse(): (instance: Queryable2) => Queryable2 {

    return parseBinderWithErrorCheck(r => isFunc(r.arrayBuffer) ? r.arrayBuffer() : (<any>r).buffer());
}

export async function errorCheck(url: URL, response: Response, result: any): Promise<[URL, Response, any]> {

    if (!response.ok) {
        // within these observers we just throw to indicate an unrecoverable error within the pipeline
        throw await HttpRequestError.init(response);
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

/**
 * Provides a clean way to create new parse bindings without having to duplicate a lot of boilerplate
 * Includes errorCheck ahead of the supplied impl
 *
 * @param impl Method used to parse the response
 * @returns Queryable behavior binding function
 */
export function parseBinderWithErrorCheck(impl: (r: Response) => Promise<any>): (instance: Queryable2) => Queryable2 {

    return (instance: Queryable2) => {

        // we clear anything else registered for parse
        // add error check
        // add the impl function we are supplied
        instance.on.parse(errorCheck, "replace");
        instance.on.parse(async (url: URL, response: Response, result: any): Promise<[URL, Response, any]> => {

            if (typeof result === "undefined") {
                result = await impl(response);
            }

            return [url, response, result];
        });

        return instance;
    };
}
