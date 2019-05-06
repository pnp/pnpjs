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
