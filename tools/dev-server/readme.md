# @pnp/dev-server

A simple server for serving the docs site while editing documentation and assets. Created as a learning exercise and to provide the bare-minimum of required functionality.

`npm install @pnp/dev-server --save`

```JavaScript
const serverFactory = require("@pnp/dev-server");

serverFactory({
    root: "./wwwroot",
    path: "/serve/path"
}).then(server => {

    console.log(`server.listening: ${server.listening}`);
}).catch(e => {

    done(e);
});
```

## Options

The below object represents the available options as well as their defaults

```JavaScript
{
    root: "./", // string, directory from which files are served
    path: "/", // string, path after http://localhost
    port: 8888, // port, from which files are served
    livereload: true, // enable live reload in the browser
    open: true, // open the served url in the default browser
    debug: false, // enable some debugging information, written to console (minimal)
}
```
