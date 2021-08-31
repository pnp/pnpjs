import { ILogEntry, LogLevel, ILogListener } from "./logger.js";

export function ConsoleListener(): ILogListener {
    return new _ConsoleListener();
}

/**
 * Text color options for use in the ConsoleListener
 * All values can be specified as known names, hex values, rgb, or rgba values
 */
export interface IConsoleListenerColors {
    /** Default text color for all logging levels unless they're specified */
    color?: string;

    /** Text color to use for messages with LogLevel.Verbose */
    verboseColor?: string;

    /** Text color to use for messages with LogLevel.Info */
    infoColor?: string;

    /** Text color to use for messages with LogLevel.Warning */
    warningColor?: string;

    /** Text color to use for messages with LogLevel.Error */
    errorColor?: string;
}

/**
 * Implementation of LogListener which logs to the console
 *
 */
export class _ConsoleListener implements ILogListener {

    private _prefix: string;
    private _colors: IConsoleListenerColors;

    /**
     * Makes a new one
     *
     * @param prefix Optional text to include at the start of all messages (useful for filtering)
     * @param colors Optional text color settings
     */
    constructor(prefix: string = "", colors: IConsoleListenerColors = {}) {
        this._prefix = prefix;
        this._colors = {
            verboseColor: colors.color,
            infoColor: colors.color,
            warningColor: colors.color,
            errorColor: colors.color,
            ...colors
        };
    }

    /**
     * Any associated data that a given logging listener may choose to log or ignore
     *
     * @param entry The information to be logged
     */
    public log(entry: ILogEntry): void {

        const msg = this.format(entry);

        switch (entry.level) {
            case LogLevel.Verbose:
                if (typeof this._colors.verboseColor !== "undefined") {
                    console.log(`%c${msg}`, `color:${this._colors.verboseColor}`);
                } else {
                    console.log(msg);
                }
                break;
            case LogLevel.Info:
                if (typeof this._colors.infoColor !== "undefined") {
                    console.log(`%c${msg}`, `color:${this._colors.infoColor}`);
                } else {
                    console.log(msg);
                }
                break;
            case LogLevel.Warning:
                if (typeof this._colors.warningColor !== "undefined") {
                    console.warn(`%c${msg}`, `color:${this._colors.warningColor}`);
                } else {
                    console.warn(msg);
                }
                break;
            case LogLevel.Error:
                if (typeof this._colors.errorColor !== "undefined") {
                    console.error(`%c${msg}`, `color:${this._colors.errorColor}`);
                } else {
                    console.error(msg);
                }
                break;
        }
    }

    /**
     * Formats the message
     *
     * @param entry The information to format into a string
     */
    private format(entry: ILogEntry): string {
        const msg = [];

        if (this._prefix.length > 0) {
            msg.push(`${this._prefix} - `);
        }

        if (entry.data !== undefined) {
            msg.push("Message: " + entry.message);
            try {
                msg.push(" Data: " + JSON.stringify(entry.data));
            } catch (e) {
                msg.push(` Data: Error in stringify of supplied data ${e}`);
            }
        } else {
            msg.push(entry.message);
        }

        return msg.join("");
    }
}

export function FunctionListener(impl: (entry: ILogEntry) => void): ILogListener {
    return new _FunctionListener(impl);
}

/**
 * Implementation of LogListener which logs to the supplied function
 *
 */
export class _FunctionListener implements ILogListener {

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
