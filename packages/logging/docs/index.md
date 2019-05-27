# @pnp/logging

[![npm version](https://badge.fury.io/js/%40pnp%2Flogging.svg)](https://badge.fury.io/js/%40pnp%2Flogging)

The logging module provides light weight subscribable and extensiable logging framework which is used internally and available for use in your projects. This article outlines how to setup logging and use the various loggers.

## Getting Started

Install the logging module, it has no other dependencies

`npm install @pnp/logging --save`

## Understanding the Logging Framework

The logging framework is based on the Logger class to which any number of listeners can be subscribed. Each of these listeners will receive each of the messages logged. Each listener must implement the _LogListener_ interface, shown below. There is only one method to implement and it takes an instance of the LogEntry interface.

```TypeScript
/**
 * Interface that defines a log listener
 *
 */
export interface LogListener {
    /**
     * Any associated data that a given logging listener may choose to log or ignore
     *
     * @param entry The information to be logged
     */
    log(entry: LogEntry): void;
}

/**
 * Interface that defines a log entry
 *
 */
export interface LogEntry {
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
```

### Log Levels

```TypeScript
export const enum LogLevel {
    Verbose = 0,
    Info = 1,
    Warning = 2,
    Error = 3,
    Off = 99,
}
```

## Writing to the Logger

To write information to a logger you can use either write, writeJSON, or log.

```TypeScript
import {
    Logger,
    LogLevel
} from "@pnp/logging";

// write logs a simple string as the message value of the LogEntry
Logger.write("This is logging a simple string");

// optionally passing a level, default level is Verbose
Logger.write("This is logging a simple string", LogLevel.Error);

// this will convert the object to a string using JSON.stringify and set the message with the result
Logger.writeJSON({ name: "value", name2: "value2"});

// optionally passing a level, default level is Verbose
Logger.writeJSON({ name: "value", name2: "value2"}, LogLevel.Warn);

// specify the entire LogEntry interface using log
Logger.log({
    data: { name: "value", name2: "value2"},
    level: LogLevel.Warning,
    message: "This is my message"
});
```

## Log an error

There exists a shortcut method to log an error to the Logger. This will log an entry to the subscribed loggers where the data property will be the Error
instance pased in, the level will be Error, and the message will be the Error instance message.

```TypeScript
const e = new Error("An Error");

Logger.error(e);
```

## Subscribing a Listener

By default no listeners are subscribed, so if you would like to get logging information you need to subscribe at least one listener. This is done as shown below by importing the Logger and your listener(s) of choice. Here we are using the provided ConsoleListener. We are also setting the active log level, which controls the level of logging that will be output. Be aware that Verbose produces a substantial amount of data about each request.

```TypeScript
import {
    Logger,
    ConsoleListener,
    LogLevel
} from "@pnp/logging";

// subscribe a listener
Logger.subscribe(new ConsoleListener());

// set the active log level
Logger.activeLogLevel = LogLevel.Info;
```

## Available Listeners

There are two listeners included in the library, ConsoleListener and FunctionListener.

### ConsoleListener

This listener outputs information to the console and works in Node as well as within browsers. It takes no settings and writes to the appropriate console method based on message level. For example a LogEntry with level Warning will be written to console.warn. Usage is shown in the example above.

### FunctionListener

The FunctionListener allows you to wrap any functionality by creating a function that takes a LogEntry as its single argument. This produces the same result as implementing the LogListener interface, but is useful if you already have a logging method or framework to which you want to pass the messages.

```TypeScript
import {
    Logger,
    FunctionListener,
    LogEntry
} from "@pnp/logging";

let listener = new FunctionListener((entry: LogEntry) => {

    // pass all logging data to an existing framework
    MyExistingCompanyLoggingFramework.log(entry.message);
});

Logger.subscribe(listener);
```

### Create a Custom Listener

If desirable for your project you can create a custom listener to perform any logging action you would like. This is done by implementing the LogListener interface.

```TypeScript
import {
    Logger,
    LogListener,
    LogEntry
} from "@pnp/logging";

class MyListener implements LogListener {

    log(entry: LogEntry): void {
        // here you would do something with the entry
    }    
}

Logger.subscribe(new MyListener());
```

## UML
![Graphical UML diagram](../../documentation/img/pnpjs-logging-uml.svg)

Graphical UML diagram of @pnp/logging. Right-click the diagram and open in new tab if it is too small.
