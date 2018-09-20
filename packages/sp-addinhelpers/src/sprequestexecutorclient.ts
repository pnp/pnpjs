import { extend, HttpClientImpl } from "@pnp/common";

/**
 * Makes requests using the SP.RequestExecutor library.
 */
export class SPRequestExecutorClient implements HttpClientImpl {
    /**
     * Fetches a URL using the SP.RequestExecutor library.
     */
    public fetch(url: string, options: any): Promise<Response> {
        if (SP === undefined || SP.RequestExecutor === undefined) {
            throw Error("SP.RequestExecutor is undefined. Load the SP.RequestExecutor.js library (/_layouts/15/SP.RequestExecutor.js) before loading the PnP JS Core library.");
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
                requestOptions = extend(requestOptions, { body: options.body });
            } else {
                requestOptions = extend(requestOptions, { binaryStringRequestBody: true });
            }
            executor.executeAsync(requestOptions);
        });
    }

    /**
     * Converts a SharePoint REST API response to a fetch API response.
     */
    private convertToResponse = (spResponse: SP.ResponseInfo): Response => {
        const responseHeaders = new Headers();

        if (spResponse.headers !== undefined) {
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
