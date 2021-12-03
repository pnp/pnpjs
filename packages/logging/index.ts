export * from "./listeners.js";

/**
 * A set of logging levels
 */
export const enum LogLevel {
    Verbose = 0,
    Info = 1,
    Warning = 2,
    Error = 3,
    Off = 99,
}

/**
 * Interface that defines a log entry
 *
 */
export interface ILogEntry {
    /**
   * The main message to be logged
   */
    message: string;
    /**
   * The level of information this message represents
   */
    level: LogLevel;
    /**
   * Any associated data that a given logging listener may choose to log or ignore
   */
    data?: any;
}

/**
 * Interface that defines a log listener
 *
 */
export interface ILogListener {
    /**
     * Any associated data that a given logging listener may choose to log or ignore
     *
     * @param entry The information to be logged
     */
    log(entry: ILogEntry): void;
}

const _subscribers: ILogListener[] = [];
let _activeLogLevel: LogLevel = LogLevel.Warning;

/**
 * Class used to subscribe ILogListener and log messages throughout an application
 *
 */
export class Logger {

    /**
   * Gets or sets the active log level to apply for log filtering
   */
    public static get activeLogLevel(): LogLevel {
        return _activeLogLevel;
    }

    public static set activeLogLevel(value: LogLevel) {
        _activeLogLevel = value;
    }

    /**
     * Adds ILogListener instances to the set of subscribed listeners
     *
     * @param listeners One or more listeners to subscribe to this log
     */
    public static subscribe(...listeners: ILogListener[]): void {
        _subscribers.push(...listeners);
    }

    /**
   * Clears the subscribers collection, returning the collection before modification
   */
    public static clearSubscribers(): ILogListener[] {
        const s = _subscribers.slice(0);
        _subscribers.length = 0;
        return s;
    }

    /**
   * Gets the current subscriber count
   */
    public static get count(): number {
        return _subscribers.length;
    }

    /**
   * Writes the supplied string to the subscribed listeners
   *
   * @param message The message to write
   * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Info)
   */
    public static write(message: string, level: LogLevel = LogLevel.Info) {
        Logger.log({ level: level, message: message });
    }

    /**
   * Writes the supplied string to the subscribed listeners
   *
   * @param json The json object to stringify and write
   * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Info)
   */
    public static writeJSON(json: any, level: LogLevel = LogLevel.Info) {
        Logger.write(JSON.stringify(json), level);
    }

    /**
   * Logs the supplied entry to the subscribed listeners
   *
   * @param entry The message to log
   */
    public static log(entry: ILogEntry) {
        if (entry !== undefined && Logger.activeLogLevel <= entry.level) {
            _subscribers.map(subscriber => subscriber.log(entry));
        }
    }

    /**
   * Logs an error object to the subscribed listeners
   *
   * @param err The error object
   */
    public static error(err: Error) {
        Logger.log({ data: err, level: LogLevel.Error, message: err.message });
    }
}

export function PnPLogging<T>(activeLevel: LogLevel): (o: T) => T {

    return (instance: T) => {

        (<any>instance).on.log(function (message: string, level: LogLevel) {

            if (activeLevel <= level) {
                _subscribers.map(subscriber => subscriber.log({ level, message }));
            }
        });

        return instance;
    };
}
