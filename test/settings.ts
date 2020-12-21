import { Configuration } from "@azure/msal-node";

export interface ISettings {
    enableWebTests: boolean;
    graph?: {
        id?: string;
        secret?: string;
        tenant?: string;
        msal?: {
            init: Configuration;
            scopes: string[];
        };
    };
    sp?: {
        webUrl?: string;
        id?: string;
        notificationUrl?: string | null;
        secret?: string;
        url: string;
        msal?: {
            init: Configuration;
            scopes: string[];
        };
    };
}

export interface ITestingSettings {
    testing: ISettings;
}
