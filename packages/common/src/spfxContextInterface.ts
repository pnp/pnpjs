export interface ISPFXContext {

    graphHttpClient: {
        fetch(url: string, configuration: any, options: any): Promise<Response>,
    };

    pageContext: {
        web: {
            absoluteUrl: string,
        },
    };
}
