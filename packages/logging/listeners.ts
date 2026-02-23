/* eslint-disable no-console */
import { ILogEntry, ILogListener, LogLevel } from "./index.js";

export function ConsoleListener(prefix?: string, colors?: IConsoleListenerColors): ILogListener {
    return new _ConsoleListener(prefix, colors);
}

/**
 * Text color options for use in the ConsoleListener
 * All values can be specified as known names, hex values, rgb, or rgba values
 */
export interface IConsoleListenerColors {
    /** Default text color for all logging levels unless they're specified */
    color?: string;

    /** Text color to use for messages with LogLevel.Verbose */
    verbose?: string;

    /** Text color to use for messages with LogLevel.Info */
    info?: string;

    /** Text color to use for messages with LogLevel.Warning */
    warning?: string;

    /** Text color to use for messages with LogLevel.Error */
    error?: string;
}

function withColor(msg: string, color: string | undefined, logMethod): void {
    if (typeof color === "undefined") {
        logMethod(msg);
    } else {
        logMethod(`%c${msg}`, `color:${color}`);
    }
}

/**
 * Formats the message
 *
 * @param entry The information to format into a string
 */
function entryToString(entry: ILogEntry, prefix: string): string {
    const msg: string[] = [];

    if (prefix.length > 0) {
        msg.push(`${prefix} -`);
    }

    msg.push(entry.message);

    if (entry.data !== undefined) {
        try {
            msg.push("Data: " + JSON.stringify(entry.data));
        } catch (e) {
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
class _ConsoleListener implements ILogListener {

    /**
     * Makes a new one
     *
     * @param prefix Optional text to include at the start of all messages (useful for filtering)
     * @param colors Optional text color settings
     */
    constructor(private _prefix = "", private _colors: IConsoleListenerColors = {}) { }

    /**
     * Any associated data that a given logging listener may choose to log or ignore
     *
     * @param entry The information to be logged
     */
    public log(entry: ILogEntry): void {

        let logMethod = console.log;
        switch(entry.level){
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

export function FunctionListener(impl: (entry: ILogEntry) => void): ILogListener {
    return new _FunctionListener(impl);
}

/**
 * Implementation of LogListener which logs to the supplied function
 *
 */
class _FunctionListener implements ILogListener {

    /**
     * Creates a new instance of the FunctionListener class
     *
     * @constructor
     * @param  method The method to which any logging data will be passed
     */
    constructor(private method: (entry: ILogEntry) => void) { }

    /**
     * Any associated data that a given logging listener may choose to log or ignore
     *
     * @param entry The information to be logged
     */
    public log(entry: ILogEntry): void {
        this.method(entry);
    }
}
