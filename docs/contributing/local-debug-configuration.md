# Local Debugging Configuration

This article covers the local setup required to debug the library and run tests. This only needs to be done once (unless you update the app registrations, then you just need to update the settings.js file accordingly).

## Create settings.js

Both local debugging and tests make use of a settings.js file located in the root of the project. Ensure you create a settings.js files by copying settings.example.js and renaming it to settings.js.
For more information the settings file please see [`Settings`](./settings.md)

### Minimal Configuration

You can control which tests are run by including or omitting sp and graph sections. If sp is present and graph is not, only sp tests are run. Include both and all tests are run, respecting the enableWebTests flag.

The following configuration file allows you to run all the tests that do not contact services.

```js
 var sets = {
     testing: {
         enableWebTests: false,
     }
 }

module.exports = sets;
```

## Test your setup

If you hit F5 in VSCode now you should be able to see the full response from getting the web's title in the internal console window. If not, ensure that you have properly updated the settings file and registered the add-in perms correctly.
