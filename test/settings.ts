import { Configuration } from "@azure/msal-node";

export interface ISettings {
    enableWebTests: boolean;
    testUser?: string;
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
        testWebUrl?: string;
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
