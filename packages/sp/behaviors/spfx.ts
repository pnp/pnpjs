import { combine, isUrlAbsolute, TimelinePipe } from "@pnp/core";
import { BrowserFetchWithRetry, DefaultParse, Queryable } from "@pnp/queryable";
import { DefaultHeaders, DefaultInit } from "./defaults.js";
import { SPTagging } from "./telemetry.js";

interface ISPFXContext {

    aadTokenProviderFactory?: {
        getTokenProvider(): Promise<{
            getToken(resource: string): Promise<string>;
        }>;
    };

    msGraphClientFactory?: {
        getClient: () => Promise<any>;
    };

    pageContext: {
        web: {
            absoluteUrl: string;
        };
    };
}

// TODO:: untested
export function SPFx(context: ISPFXContext): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.using(
            DefaultHeaders(),
            DefaultInit(),
            BrowserFetchWithRetry(),
            DefaultParse());

        instance.on.pre(async (url, init, result) => {

            if (!isUrlAbsolute(url)) {
                url = combine(context.pageContext.web.absoluteUrl, url);
            }

            return [url, init, result];
        });



        //     **
        //     * Client wrapping the aadTokenProvider available from SPFx >= 1.6
        //     */
        //    export class SPFxAdalClient extends LambdaFetchClient {

        //        /**
        //         *
        //         * @param context provide the appropriate SPFx Context object
        //         */
        //        constructor(private context: ISPFXContext) {
        //            super(async (params) => {
        //                const provider = await context.aadTokenProviderFactory.getTokenProvider();
        //                return provider.getToken(getADALResource(params.url));
        //            });
        //        }

        //        /**
        //         * Gets an AAD token for the provided resource using the SPFx AADTokenProvider
        //         *
        //         * @param resource Resource for which a token is to be requested (ex: https://graph.microsoft.com)
        //         */
        //        public async getToken(resource: string): Promise<string> {
        //            const provider = await this.context.aadTokenProviderFactory.getTokenProvider();
        //            return provider.getToken(resource);
        //        }
        //    }




        return instance;
    };
}
