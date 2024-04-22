export * from "./listeners.js";
/**
 * A set of logging levels
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Verbose"] = 0] = "Verbose";
    LogLevel[LogLevel["Info"] = 1] = "Info";
    LogLevel[LogLevel["Warning"] = 2] = "Warning";
    LogLevel[LogLevel["Error"] = 3] = "Error";
    LogLevel[LogLevel["Off"] = 99] = "Off";
})(LogLevel || (LogLevel = {}));
const _subscribers = [];
let _activeLogLevel = LogLevel.Warning;
/**
 * Class used to subscribe ILogListener and log messages throughout an application
 *
 */
export class Logger {
    /**
   * Gets or sets the active log level to apply for log filtering
   */
    static get activeLogLevel() {
        return _activeLogLevel;
    }
    static set activeLogLevel(value) {
        _activeLogLevel = value;
    }
    /**
     * Adds ILogListener instances to the set of subscribed listeners
     *
     * @param listeners One or more listeners to subscribe to this log
     */
    static subscribe(...listeners) {
        _subscribers.push(...listeners);
    }
    /**
   * Clears the subscribers collection, returning the collection before modification
   */
    static clearSubscribers() {
        const s = _subscribers.slice(0);
        _subscribers.length = 0;
        return s;
    }
    /**
   * Gets the current subscriber count
   */
    static get count() {
        return _subscribers.length;
    }
    /**
   * Writes the supplied string to the subscribed listeners
   *
   * @param message The message to write
   * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Info)
   */
    static write(message, level = LogLevel.Info) {
        Logger.log({ level: level, message: message });
    }
    /**
   * Writes the supplied string to the subscribed listeners
   *
   * @param json The json object to stringify and write
   * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Info)
   */
    static writeJSON(json, level = LogLevel.Info) {
        Logger.write(JSON.stringify(json), level);
    }
    /**
   * Logs the supplied entry to the subscribed listeners
   *
   * @param entry The message to log
   */
    static log(entry) {
        if (entry !== undefined && Logger.activeLogLevel <= entry.level) {
            _subscribers.map(subscriber => subscriber.log(entry));
        }
    }
    /**
   * Logs an error object to the subscribed listeners
   *
   * @param err The error object
   */
    static error(err) {
        Logger.log({ data: err, level: LogLevel.Error, message: err.message });
    }
}
export function PnPLogging(activeLevel) {
    return (instance) => {
        instance.on.log(function (message, level) {
            if (activeLevel <= level) {
                _subscribers.map(subscriber => subscriber.log({ level, message }));
            }
        });
        return instance;
    };
}
