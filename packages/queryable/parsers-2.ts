import { Queryable2 } from "./queryable-2";
import { HttpRequestError } from "./parsers";

export function DefaultParsing(): (instance: Queryable2) => Queryable2 {

    return (instance: Queryable2) => {

        instance.on.parse(errorCheck, "replace");
        instance.on.parse(defaultParse);

        return instance;
    };
}

export async function errorCheck(url: string, response: Response, result: any): Promise<[string, Response, any]> {

    if (!response.ok) {
        // within these observers we just throw to indicate an unrecoverable error within the pipeline
        throw await HttpRequestError.init(response);
    }

    return [url, response, result];
}

export async function defaultParse(url: string, response: Response, result: any): Promise<[string, Response, any]> {

    // only update result if not done?
    if (typeof result === "undefined") {
        result = await response.text();
    }

    // only update result if not done?
    if (typeof result !== "undefined") {
        result = JSON.parse(result);
    }

    return [url, response, result];
}
