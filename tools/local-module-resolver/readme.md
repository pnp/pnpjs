# local-module-resolver

This tool lib allows us to resolve our modules when testing. For example, an import in @pnp/sp might point to @pnp/common and for testing the @pnp/common doesn't resolve correctly to the built test code. By default it would try to resolve it to node modules, but we rewrite the import to resolve to `./build/testing/packages/*`.

To use it with mocha you need to supply a require entry to mocha:

mocha --require ./tools/local-module-resolver/register.js

see: [.mocharc.js](../../.mocharc.js) for a code config example
