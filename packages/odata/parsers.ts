import { isFunc, hOP } from "@pnp/common";

export interface IODataParser<T> {
    hydrate?: (d: any) => T;
    parse(r: Response): Promise<T>;
}

export class ODataParser<T = any> implements IODataParser<T> {

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

export class TextParser extends ODataParser<string> {

    protected parseImpl(r: Response, resolve: (value: any) => void): void {

        r.text().then(resolve);
    }
}

export class BlobParser extends ODataParser<Blob> {

    protected parseImpl(r: Response, resolve: (value: any) => void): void {
        r.blob().then(resolve);
    }
}

export class JSONParser extends ODataParser<any> {

    protected parseImpl(r: Response, resolve: (value: any) => void): void {

        r.json().then(resolve);
    }
}

export class BufferParser extends ODataParser<ArrayBuffer> {

    protected parseImpl(r: Response, resolve: (value: any) => void): void {

        if (isFunc(r.arrayBuffer)) {

            r.arrayBuffer().then(resolve);
        } else {

            (<any>r).buffer().then(resolve);
        }
    }
}

export class LambdaParser<T = any> extends ODataParser<T> {

    constructor(private parser: (r: Response) => Promise<T>) {
        super();
    }

    protected parseImpl(r: Response, resolve: (value: any) => void): void {

        this.parser(r).then(resolve);
    }
}

export class HttpRequestError extends Error {

    public isHttpRequestError = true;

    constructor(message: string, public response: Response, public status = response.status, public statusText = response.statusText) {
        super(message);
    }

    public static async init(r: Response): Promise<HttpRequestError> {

        const t = await r.clone().text();
        return new HttpRequestError(`Error making HttpClient request in queryable [${r.status}] ${r.statusText} ::> ${t}`, r.clone());
    }
}
