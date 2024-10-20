# Authentication in a custom browser based application

We support MSAL for both browser and nodejs by providing a thin wrapper around the official libraries. We won't document the fully possible MSAL configuration, but any parameters supplied are passed through to the underlying implementation. To use the browser MSAL package you'll need to install the @pnp/msaljsclient package which is deployed as a standalone due to the large MSAL dependency.
This library provides a thin wrapper around the [@azure/msal-browser](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser/docs) library to make it easy to integrate MSAL authentication in the browser.

Please see more scenarios in the [authentication article](../msaljsclient/index.md).
