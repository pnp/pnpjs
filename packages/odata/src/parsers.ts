import { isFunc, hOP } from "@pnp/common";
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
                this.parseImpl(r, resolve, reject);
            }
        });
    }

    protected parseImpl(r: Response, resolve: (value?: T | PromiseLike<T>) => void, reject: (value?: T | PromiseLike<T>) => void): void {
        if ((r.headers.has("Content-Length") && parseFloat(r.headers.get("Content-Length")) === 0) || r.status === 204) {
            resolve(<T>{});
        } else {

            // patch to handle cases of 200 response with no or whitespace only bodies (#487 & #545)
            r.text()
                .then(txt => txt.replace(/\s/ig, "").length > 0 ? JSON.parse(txt) : {})
                .then(json => resolve(this.parseODataJSON<T>(json)))
                .catch(e => reject(e));
        }
    }

    /**
     * Handles a response with ok === false by parsing the body and creating a ProcessHttpClientResponseException
     * which is passed to the reject delegate. This method returns true if there is no error, otherwise false
     *
     * @param r Current response object
     * @param reject reject delegate for the surrounding promise
     */
    protected handleError(r: Response, reject: (reason?: any) => void): boolean {
        if (!r.ok) {

            // read the response as text, it may not be valid json
            r.json().then(json => {

                // include the headers as they contain diagnostic information
                const data = {
                    responseBody: json,
                    responseHeaders: r.headers,
                };

                reject(new ProcessHttpClientResponseException(r.status, r.statusText, data));

            }).catch(e => {
                reject(new ProcessHttpClientResponseException(r.status, r.statusText, e));
            });
        }

        return r.ok;
    }

    /**
     * Normalizes the json response by removing the various nested levels
     *
     * @param json json object to parse
     */
    protected parseODataJSON<U>(json: any): U {
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
}

export class ODataDefaultParser extends ODataParserBase<any> {
}

export class TextParser extends ODataParserBase<string> {

    protected parseImpl(r: Response, resolve: (value: any) => void): void {
        r.text().then(resolve);
    }
}

export class BlobParser extends ODataParserBase<Blob> {

    protected parseImpl(r: Response, resolve: (value: any) => void): void {
        r.blob().then(resolve);
    }
}

export class JSONParser extends ODataParserBase<any> {

    protected parseImpl(r: Response, resolve: (value: any) => void): void {
        r.json().then(resolve);
    }
}

export class BufferParser extends ODataParserBase<ArrayBuffer> {

    protected parseImpl(r: Response, resolve: (value: any) => void): void {

        if (isFunc(r.arrayBuffer)) {
            r.arrayBuffer().then(resolve);
        } else {
            (<any>r).buffer().then(resolve);
        }
    }
}

export class LambdaParser<T = any> implements ODataParser<T> {

    constructor(private parser: (r: Response) => Promise<T>) { }

    public parse(r: Response): Promise<T> {
        return this.parser(r);
    }
}
