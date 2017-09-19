import { ConfigOptions } from "./netutil";
import { Util } from "./util";

export function mergeOptions(target: ConfigOptions, source: ConfigOptions): void {

    if (Util.objectDefinedNotNull(source)) {
        const headers = Util.extend(target.headers || {}, source.headers);
        target = Util.extend(target, source);
        target.headers = headers;
    }
}
