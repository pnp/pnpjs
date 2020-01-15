/**
 * Class used to subscribe ILogListener and log messages throughout an application
 *
 */
export class Logger {

  private static _instance: LoggerImpl;

  /**
   * Gets or sets the active log level to apply for log filtering
   */
  public static get activeLogLevel(): LogLevel {
    return Logger.instance.activeLogLevel;
  }

  public static set activeLogLevel(value: LogLevel) {
    Logger.instance.activeLogLevel = value;
  }

  private static get instance(): LoggerImpl {
    if (Logger._instance === undefined || Logger._instance === null) {
      Logger._instance = new LoggerImpl();
    }
    return Logger._instance;
  }

  /**
   * Adds ILogListener instances to the set of subscribed listeners
   *
   * @param listeners One or more listeners to subscribe to this log
   */
  public static subscribe(...listeners: ILogListener[]): void {
    listeners.forEach(listener => Logger.instance.subscribe(listener));
  }

  /**
   * Clears the subscribers collection, returning the collection before modification
   */
  public static clearSubscribers(): ILogListener[] {
    return Logger.instance.clearSubscribers();
  }

  /**
   * Gets the current subscriber count
   */
  public static get count(): number {
    return Logger.instance.count;
  }

  /**
   * Writes the supplied string to the subscribed listeners
   *
   * @param message The message to write
   * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Info)
   */
  public static write(message: string, level: LogLevel = LogLevel.Info) {
    Logger.instance.log({ level: level, message: message });
  }

  /**
   * Writes the supplied string to the subscribed listeners
   *
   * @param json The json object to stringify and write
   * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Info)
   */
  public static writeJSON(json: any, level: LogLevel = LogLevel.Info) {
    this.write(JSON.stringify(json), level);
  }

  /**
   * Logs the supplied entry to the subscribed listeners
   *
   * @param entry The message to log
   */
  public static log(entry: ILogEntry) {
    Logger.instance.log(entry);
  }

  /**
   * Logs an error object to the subscribed listeners
   * 
   * @param err The error object
   */
  public static error(err: Error) {
    Logger.instance.log({ data: err, level: LogLevel.Error, message: err.message });
  }
}

class LoggerImpl {

  constructor(public activeLogLevel: LogLevel = LogLevel.Warning, private subscribers: ILogListener[] = []) { }

  public subscribe(listener: ILogListener): void {
    this.subscribers.push(listener);
  }

  public clearSubscribers(): ILogListener[] {
    const s = this.subscribers.slice(0);
    this.subscribers.length = 0;
    return s;
  }

  public get count(): number {
    return this.subscribers.length;
  }

  public write(message: string, level: LogLevel = LogLevel.Info) {
    this.log({ level: level, message: message });
  }

  public log(entry: ILogEntry) {
    if (entry !== undefined && this.activeLogLevel <= entry.level) {
      this.subscribers.map(subscriber => subscriber.log(entry));
    }
  }
}

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
