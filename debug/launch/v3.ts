import { ITestingSettings } from "../../test/settings.js";
import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";
import { sp } from "@pnp/sp";
import { spSetup } from "./setup.js";
import { Queryable2, InjectHeaders, Caching, HttpRequestError } from "@pnp/queryable";
import "@pnp/sp/webs";
import { NodeSend, MSAL2 } from "@pnp/nodejs";
import { combine, isFunc, getHashCode, PnPClientStorage, dateAdd } from "@pnp/common";

declare var process: { exit(code?: number): void };

export async function Example(settings: ITestingSettings) {


    const t = new Queryable2({
        url: combine(settings.testing.sp.url, "_api/web"),
    });

    // most basic implementation
    t.on.log((message: string, level: LogLevel) => {
        console.log(`[${level}] ${message}`);
    });

    // super easy debug
    t.on.error((err) => {
        console.error(err);
    });

    // MSAL config via using?
    t.using(MSAL2(settings.testing.sp.msal.init, settings.testing.sp.msal.scopes));

    // or directly into the event?
    // t.on.pre(MSAL(settings.testing.sp.msal.init, settings.testing.sp.msal.scopes));

    // how to register your own pre-handler
    // t.on.pre(async function (url: string, init: RequestInit) {

    //     // example of setting up default values
    //     url = combine(url, "_api/web");

    //     init.headers["Accept"] = "application/json";
    //     init.headers["Content-Type"] = "application/json;odata=verbose;charset=utf-8";

    //     this.log(`Url: ${url}`);

    //     return [url, init];
    // });

    t.using(InjectHeaders({
        "Accept": "application/json",
        "Content-Type": "application/json;odata=verbose;charset=utf-8",
    }));

    // use the basic caching that mimics v2
    t.using(Caching());

    // we can replace
    t.on.send(NodeSend());
    t.on.send(NodeSend(), "replace");

    // we can register multiple parse handlers to run in sequence
    // here we are doing some error checking??
    // TODO:: do we want a specific response validation step? seems maybe too specialized?
    t.on.parse(async function (url: string, response: Response, result: any) {

        if (!response.ok) {
            // within these observers we just throw to indicate an unrecoverable error within the pipeline
            throw await HttpRequestError.init(response);
        }

        return [url, response, result];
    });

    // we can register multiple parse handlers to run in sequence
    t.on.parse(async function (url: string, response: Response, result: any) {

        // only update result if not done?
        if (typeof result === "undefined") {
            result = await response.text();
        }

        return [url, response, result];
    });

    // we can register multiple parse handlers to run in sequence
    t.on.parse(async function (url: string, response: Response, result: any) {

        // only update result if not done?
        if (typeof result !== "undefined") {
            result = JSON.parse(result);
        }

        return [url, response, result];
    });

    try {

        const y = await t.start();

        const y2 = await t.start();
    
        console.log(y);
    
        console.log(y2);

    } catch(e) {
        console.error("this");
        console.error(e);
    }



    process.exit(0);
}
