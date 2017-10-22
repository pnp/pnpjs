export interface ISPFXGraphHttpClient {
    fetch(url: string, configuration: any, options: any): Promise<Response>;
}

export interface ISPFXContext {

    graphHttpClient: ISPFXGraphHttpClient;

    pageContext: {
        web: {
            absoluteUrl: string,
        },
    };
}
