# @pnp/queryable/parsers

This modules contains a set of generic parsers. These can be used or extended as needed, though it is likely in most cases the default parser will be all you need.

## ODataDefaultParser

The simplest parser used to transform a Response into its JSON representation. The default parser will handle errors in a consistent manner throwing an HttpRequestError instance. This class extends Error and adds the response, status, and statusText properties. The response object is unread. You can use this custom error as shown below to gather more information about what went wrong in the request.

```TypeScript
import { sp } from "@pnp/sp";
import { JSONParser } from "@pnp/queryable";

try {

    const parser = new JSONParser();

    // this always throws a 404 error
    await sp.web.getList("doesn't exist").get(parser);

} catch (e) {

    // we can check for the property "isHttpRequestError" to see if this is an instance of our class
    // this gets by all the many limitations of subclassing Error and type detection in JavaScript
    if (e.hasOwnProperty("isHttpRequestError")) {

        console.log("e is HttpRequestError");

        // now we can access the various properties and make use of the response object.
        // at this point the body is unread
        console.log(`status: ${e.status}`);
        console.log(`statusText: ${e.statusText}`);

        const json = await e.response.clone().json();
        console.log(JSON.stringify(json));
        const text = await e.response.clone().text();
        console.log(text);
        const headers = e.response.headers;
    }

    console.error(e);
}
```

## TextParser

Specialized parser used to parse the response using the .text() method with no other processing. Used primarily for files.

## BlobParser

Specialized parser used to parse the response using the .blob() method with no other processing. Used primarily for files.

## JSONParser

Specialized parser used to parse the response using the .json() method with no other processing. Used primarily for files.

## BufferParser

Specialized parser used to parse the response using the .arrayBuffer() [node] for .buffer() [browser] method with no other processing. Used primarily for files.

## Custom Parser

To create your own custom parser you would need to implement your own behavior that replaces the default parser functionality.

Check out various [behavior recipes](../core/behavior-recipes.md) to get more information.