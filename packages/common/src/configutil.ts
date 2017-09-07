import { ConfigOptions } from "./netutil";
import { Util } from "./util";

export function mergeOptions(target: ConfigOptions, source: ConfigOptions): void {
    if (typeof source !== "undefined" && typeof source.headers !== "undefined") {
        const headers = Util.extend(target.headers, source.headers);
        target = Util.extend(target, source);
        target.headers = headers;
    }
}
