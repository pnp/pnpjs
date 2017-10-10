import { Logger, LogLevel } from "@pnp/logging";

/**
 * Represents an exception with an HttpClient request
 *
 */
export class ProcessHttpClientResponseException extends Error {

    constructor(public readonly status: number, public readonly statusText: string, public readonly data: any) {
        super(`Error making HttpClient request in queryable: [${status}] ${statusText}`);
        this.name = "ProcessHttpClientResponseException";
        Logger.log({ data: this.data, level: LogLevel.Error, message: this.message });
    }
}

export interface ODataParser<T> {
    hydrate?: (d: any) => T;
    parse(r: Response): Promise<T>;
}

export abstract class ODataParserBase<T> implements ODataParser<T> {

    public parse(r: Response): Promise<T> {

        return new Promise<T>((resolve, reject) => {

            if (this.handleError(r, reject)) {
                if ((r.headers.has("Content-Length") && parseFloat(r.headers.get("Content-Length") || "-1") === 0) || r.status === 204) {
                    resolve(<T>{});
                } else {

                    // patch to handle cases of 200 response with no or whitespace only bodies (#487 & #545)
                    r.text()
                        .then(txt => txt.replace(/\s/ig, "").length > 0 ? JSON.parse(txt) : {})
                        .then(json => resolve(this.parseODataJSON<T>(json)))
                        .catch(e => reject(e));
                }
            }
        });
    }

    protected handleError(r: Response, reject: (reason?: any) => void): boolean {
        if (!r.ok) {

            r.json().then(json => {

                // include the headers as they contain diagnostic information
                const data = {
                    responseBody: json,
                    responseHeaders: r.headers,
                };

                reject(new ProcessHttpClientResponseException(r.status, r.statusText, data));
            }).catch(e => {

                // we failed to read the body - possibly it is empty. Let's report the original status that caused
                // the request to fail and log the error without parsing the body if anyone needs it for debugging
                Logger.log({
                    data: e,
                    level: LogLevel.Warning,
                    message: "There was an error parsing the error response body. See data for details.",
                });

                // include the headers as they contain diagnostic information
                const data = {
                    responseBody: "[[body not available]]",
                    responseHeaders: r.headers,
                };

                reject(new ProcessHttpClientResponseException(r.status, r.statusText, data));
            });
        }

        return r.ok;
    }

    protected parseODataJSON<U>(json: any): U {
        let result = json;
        if (json.hasOwnProperty("d")) {
            if (json.d.hasOwnProperty("results")) {
                result = json.d.results;
            } else {
                result = json.d;
            }
        } else if (json.hasOwnProperty("value")) {
            result = json.value;
        }
        return result;
    }
}
