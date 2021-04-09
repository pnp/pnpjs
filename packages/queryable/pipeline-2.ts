/* eslint-disable @typescript-eslint/no-unused-vars */

// build request with fluent api
// get promise that request is being processed
// --
// log request start
// examine cache
// send request if not in cache
// parse response
// log request end
// resolve promise

// calling

declare const lib: {
    on: (key: string, handler: (...params: any[]) => any, replace?: boolean) => void;
};

// handle all logging events
// this: runtime ????
// this: request ????
lib.on("log", (req, message, level) => void (0));

// read cache and produce result
lib.on("cache-read", <T>(req) => Promise.resolve());

// apply auth
// apply headers
lib.on("pre-request", <T>(req) => Promise.resolve());

// execute fetch
lib.on("send", <T>(req) => Promise.resolve());

// parse
lib.on("post-request", <T>(req) => Promise.resolve());

// cache result
lib.on("cache-write", <T>(req, value) => Promise.resolve());

lib.on("error", (req, error: Error | string) => void (0));

// syncEventRunner
// asyncEventRunner

// scenarios:

// - I want to replace the send event
// - I need to apply a header AFTER the defaults
// - I need to handle a post-response BEFORE the defaults, but not replace them
// - I want to encrypt my request
// - I want to use caching
// - I want to assign different event handlers at different points of the request chain (sp.web.$ and sp.web.lists.$)
// - I want to mock requests
// - I have multiple event handlers on an event. The first one produces the result we should ultimately return, do the remain handlers run? Can they modify that result?
// - How does this pipeline handle batching?
//   - Is there a "send" handler that aggregates the requests? Each item in the batch shares the same event handler?
// -


/**
 *
 * invoke() (.get())
 *
 *
 *
 *
 *
 *
 */
















