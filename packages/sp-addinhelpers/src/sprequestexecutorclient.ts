import { Util, HttpClientImpl } from "@pnp/common";
import { SPRequestExecutorUndefinedException } from "./exceptions";

/**
 * Makes requests using the SP.RequestExecutor library.
 */
export class SPRequestExecutorClient implements HttpClientImpl {
    /**
     * Fetches a URL using the SP.RequestExecutor library.
     */
    public fetch(url: string, options: any): Promise<Response> {
        if (typeof SP === "undefined" || typeof SP.RequestExecutor === "undefined") {
            throw new SPRequestExecutorUndefinedException();
        }

        const addinWebUrl = url.substring(0, url.indexOf("/_api")),
            executor = new SP.RequestExecutor(addinWebUrl);

        let headers: { [key: string]: string; } = {},
            iterator: IterableIterator<[string, string]>,
            temp: IteratorResult<[string, string]>;

        if (options.headers && options.headers instanceof Headers) {
            iterator = <IterableIterator<[string, string]>>options.headers.entries();
            temp = iterator.next();
            while (!temp.done) {
                headers[temp.value[0]] = temp.value[1];
                temp = iterator.next();
            }
        } else {
            headers = <any>options.headers;
        }

        return new Promise((resolve, reject) => {

            let requestOptions = {
                error: (error: SP.ResponseInfo) => {
                    reject(this.convertToResponse(error));
                },
                headers: headers,
                method: options.method,
                success: (response: SP.ResponseInfo) => {
                    resolve(this.convertToResponse(response));
                },
                url: url,
            };

            if (options.body) {
                requestOptions = Util.extend(requestOptions, { body: options.body });
            } else {
                requestOptions = Util.extend(requestOptions, { binaryStringRequestBody: true });
            }
            executor.executeAsync(requestOptions);
        });
    }

    /**
     * Converts a SharePoint REST API response to a fetch API response.
     */
    private convertToResponse = (spResponse: SP.ResponseInfo): Response => {
        const responseHeaders = new Headers();

        if (typeof spResponse.headers !== "undefined") {
            for (const h in spResponse.headers) {
                if (spResponse.headers[h]) {
                    responseHeaders.append(h, spResponse.headers[h]);
                }
            }
        }

        // Cannot have an empty string body when creating a Response with status 204
        const body = spResponse.statusCode === 204 ? null : spResponse.body;

        return new Response(body, {
            headers: responseHeaders,
            status: spResponse.statusCode,
            statusText: spResponse.statusText,
        });
    }
}
