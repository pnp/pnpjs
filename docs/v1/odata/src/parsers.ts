import { isFunc, hOP } from "@pnp/common";

export interface ODataParser<T> {
    hydrate?: (d: any) => T;
    parse(r: Response): Promise<T>;
}

export class HttpRequestError extends Error {

    public isHttpRequestError = true;

    constructor(message: string, public response: Response, public status = response.status, public statusText = response.statusText) {
        super(message);
    }

    public static init(r: Response): Promise<HttpRequestError> {

        return r.clone().text().then(t => {
            return new HttpRequestError(`Error making HttpClient request in queryable [${r.status}] ${r.statusText} ::> ${t}`, r.clone());
        });
    }
}

export abstract class ODataParserBase<T> implements ODataParser<T> {

    protected rawJson: any = {};

    public parse(r: Response): Promise<T> {

        return new Promise<T>((resolve, reject) => {
            if (this.handleError(r, reject)) {
                this.parseImpl(r, resolve, reject);
            }
        });
    }

    protected parseImpl(r: Response, resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: Error) => void): void {
        if ((r.headers.has("Content-Length") && parseFloat(r.headers.get("Content-Length")!) === 0) || r.status === 204) {
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
    protected handleError(r: Response, reject: (err?: Error) => void): boolean {
        if (!r.ok) {
            HttpRequestError.init(r).then(reject);
        }

        return r.ok;
    }

    /**
     * Normalizes the json response by removing the various nested levels
     *
     * @param json json object to parse
     */
    protected parseODataJSON<U>(json: any): U {
        this.rawJson = json;
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

export class ODataDefaultParser<T = any> extends ODataParserBase<T> {
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

export class LambdaParser<T = any> extends ODataParserBase<T> {

    constructor(private parser: (r: Response) => Promise<T>) {
        super();
    }

    protected parseImpl(r: Response, resolve: (value: any) => void): void {
        this.parser(r).then(resolve);
    }
}
