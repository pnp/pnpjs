import { Configuration } from "@azure/msal-node";
import { IProcessArgs } from "./args.js";
import findup from "findup-sync";

export interface ISettings {
    enableWebTests: boolean;
    testUser?: string;
    testGroupId?: string;
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

export async function getSettings(args: IProcessArgs): Promise<ISettings> {

    let settings: ITestingSettings = null;

    switch (args.mode) {

        case "online":

            settings = {
                testing: {
                    testUser: readEnvVar("PNPTESTING_TESTUSER") || null,
                    testGroupId: readEnvVar("PNPTESTING_TESTGROUPID") || null,
                    enableWebTests: true,
                    graph: {
                        msal: {
                            init: readEnvVar("PNPTESTING_MSAL_GRAPH_CONFIG", true),
                            scopes: readEnvVar("PNPTESTING_MSAL_GRAPH_SCOPES", true),
                        },
                    },
                    sp: {
                        msal: {
                            init: readEnvVar("PNPTESTING_MSAL_SP_CONFIG", true),
                            scopes: readEnvVar("PNPTESTING_MSAL_SP_SCOPES", true),
                        },
                        notificationUrl: readEnvVar("PNPTESTING_NOTIFICATIONURL") || null,
                        url: readEnvVar("PNPTESTING_SITEURL"),
                    },
                },
            };
            break;

        case "online-noweb":

            settings = {
                testing: {
                    enableWebTests: false,
                },
            };
            break;

        default:

            settings = await import(findup("settings.js")).then(s => s.settings);

            if (args.skipWeb) {
                settings.testing.enableWebTests = false;
            }
    }

    return settings.testing;
}

function readEnvVar(key: string, parse = false): any {

    const b = process.env[key];
    if (typeof b !== "string" || b.length < 1) {
        console.error(`Environment var ${key} not found.`);
    }

    if (!parse) {
        return b;
    }

    try {
        return JSON.parse(b);
    } catch (e) {
        console.error(`Error parsing env var ${key}. ${e.message}`);
    }
}
