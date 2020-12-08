import { configureProxyOptions } from "./proxy.js";
import { default as nodeFetch } from "node-fetch";

export function fetch(url: string, options: any): Promise<any> {

    options = configureProxyOptions(options);

    return nodeFetch(url, options);
}
