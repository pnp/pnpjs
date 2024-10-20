/* eslint-disable no-console */
import { LogLevel } from "./index.js";
export function ConsoleListener(prefix, colors) {
    return new _ConsoleListener(prefix, colors);
}
function withColor(msg, color, logMethod) {
    if (typeof color === "undefined") {
        logMethod(msg);
    }
    else {
        logMethod(`%c${msg}`, `color:${color}`);
    }
}
/**
 * Formats the message
 *
 * @param entry The information to format into a string
 */
function entryToString(entry, prefix) {
    const msg = [];
    if (prefix.length > 0) {
        msg.push(`${prefix} -`);
    }
    msg.push(entry.message);
    if (entry.data !== undefined) {
        try {
            msg.push("Data: " + JSON.stringify(entry.data));
        }
        catch (e) {
            msg.push(`Data: Error in stringify of supplied data ${e}`);
        }
    }
    return msg.join(" ");
}
// index order matters, this is a lookup table based on the corresponding LogLevel value
const colorProps = ["verbose", "info", "warning", "error"];
/**
 * Implementation of LogListener which logs to the console
 *
 */
class _ConsoleListener {
    /**
     * Makes a new one
     *
     * @param prefix Optional text to include at the start of all messages (useful for filtering)
     * @param colors Optional text color settings
     */
    constructor(_prefix = "", _colors = {}) {
        this._prefix = _prefix;
        this._colors = _colors;
    }
    /**
     * Any associated data that a given logging listener may choose to log or ignore
     *
     * @param entry The information to be logged
     */
    log(entry) {
        let logMethod = console.log;
        switch (entry.level) {
            case LogLevel.Error:
                logMethod = console.error;
                break;
            case LogLevel.Warning:
                logMethod = console.warn;
                break;
            case LogLevel.Verbose:
                logMethod = console.debug;
                break;
            case LogLevel.Info:
                logMethod = console.info;
                break;
            default:
                logMethod = console.log;
        }
        withColor(entryToString(entry, this._prefix), this._colors[colorProps[entry.level]], logMethod);
    }
}
export function FunctionListener(impl) {
    return new _FunctionListener(impl);
}
/**
 * Implementation of LogListener which logs to the supplied function
 *
 */
class _FunctionListener {
    /**
     * Creates a new instance of the FunctionListener class
     *
     * @constructor
     * @param  method The method to which any logging data will be passed
     */
    constructor(method) {
        this.method = method;
    }
    /**
     * Any associated data that a given logging listener may choose to log or ignore
     *
     * @param entry The information to be logged
     */
    log(entry) {
        this.method(entry);
    }
}
