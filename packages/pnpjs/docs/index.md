# @pnp/pnpjs

[![npm version](https://badge.fury.io/js/%40pnp%2Fpnpjs.svg)](https://badge.fury.io/js/%40pnp%2Fpnpjs)

The pnpjs library is a rollup of the core libraries across the @pnp scope and is designed only as a bridge to help folks transition from sp-pnp-js, primarily 
in scenarios where a single file is being imported via a script tag. **It is recommended to not use this rollup library where possible and [migrate to the 
individual libraries](../../documentation/transition-guide.md)**.

## Getting Started

There are two approaches to using this libary: the first is to import, the second is to manually extract the bundled file for use in your project.

### Install

`npm install @pnp/pnpjs --save`

You can then make use of the pnpjs rollup library within your application. It's structure matches sp-pnp-js, though some things may have changed based on the rolled-up dependencies.

```TypeScript
import pnp from "@pnp/pnpjs";

pnp.sp.web.get().then(w => {

    console.log(JSON.stringify(w, null, 4));
});
```

### Grab Bundle File

This method is useful if you are primarily working within a script editor web part or similar case where you are not using a build pipeline to bundle your application.

Install only this library.

`npm install @pnp/pnpjs`

Browse to _./node_modules/@pnp/pnpjs/dist_ and grab either _pnpjs.es5.umd.bundle.js_ or _pnpjs.es5.umd.bundle.min.js_ depending on your needs. You can then add a script tag referencing this file and you will have a global variable "pnp".

For example you could paste the following into a script editor web part:

```HTML
<p>Script Editor is on page.</p>
<script src="https://mysite/site assests/pnpjs.es5.umd.bundle.min.js" type="text/javascript"></script>
<script type="text/javascript">

    pnp.Logger.subscribe(new pnp.ConsoleListener());
    pnp.Logger.activeLogLevel = pnp.LogLevel.Info;

    pnp.sp.web.get().then(w => {

        console.log(JSON.stringify(w, null, 4));
    });
</script>
```

Alternatively to serve the script from the project at "https://localhost:8080/assets/pnp.js" you can use:

`gulp serve --p pnpjs`

This will allow you to test your changes to the entire bundle live while making updates.
