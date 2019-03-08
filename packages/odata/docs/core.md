# @pnp/odata/core

This modules contains shared interfaces and abstract classes used within, and by inheritors of, the @pnp/odata package.

## ProcessHttpClientResponseException

The exception thrown when a response is returned and cannot be processed.

## interface ODataParser<T>

Base interface used to describe a class that that will parse incoming responses. It takes a single type parameter representing the type of the
value to be returned. It has two methods, one is optional:

* parse(r: Response): Promise<T> - main method use to parse a response and return a Promise resolving to an object of type T
* hydrate?: (d: any) => T - optional method used when getting an object from the [cache](caching.md) if it requires calling a constructor

## ODataParserBase<T>

The base class used by all parsers in the @pnp libraries. It is optional to use when creating your own custom parsers, but does contain several helper
methods.

### Create a custom parser from ODataParserBase<T>

You can always create custom parsers for your projects, however it is likely you will not require this step as the default parsers should work for most
cases.

```TypeScript
class MyParser extends ODataParserBase<any> {

    // we need to override the parse method to do our custom stuff
    public parse(r: Response): Promise<T> {

        // we wrap everything in a promise
        return new Promise((resolve, reject) => {

            // lets use the default error handling which returns true for no error
            // and will call reject with an error if one exists
            if (this.handleError(r, reject)) {

                // now we add our custom parsing here
                r.text().then(txt => {
                    // here we call a madeup function to parse the result
                    // this is where we would do our parsing as required
                    myCustomerUnencode(txt).then(v => {
                        resolve(v);
                    });
                });
            }
        });
    }
}
```
