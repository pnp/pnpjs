# Authentication

One of the more challenging aspects of web development is ensuring you are properly authenticated to access the resources you need. This section is designed to guide you through connecting to the resources you need using the appropriate methods.

There are two places the PnPjs libraries can be used to connect to various services [client (browser)](#client-scenarios) or [server](#server-scenarios).

## Client Scenarios

- SharePoint Framework
    - Connect As:
        - [Current User](./client-spfx.md#connect-to-sharepoint-as-current-user)
        - [User + AAD App via MSAL](./client-spfx.md#msal-client)
        - [User + AAD App via ADAL](./client-spfx.md#adal-client)
    - Connect To:
        - SharePoint as:
            - [Current User](./client-spfx.md#connect-to-sharepoint-as-current-user)
            - [User + AAD App via MSAL](./msaljsclient.md#calling-sharepoint-via-msal)
        - Graph as:
            - [Current User](./client-spfx.md#connect-to-graph-as-current-user)
            - [User + AAD App via MSAL](./msaljsclient.md#calling-graph-via-msal)
        - Both as:
            - [Current User](./client-spfx.md#auth-as-current-user)
            - [User + AAD App via MSAL](./msaljsclient.md#calling-graph-via-msal)
- Single Page Application
    - [User + AAD App via MSAL](./msaljsclient.md#use-in-single-page-applications)

## Server Scenarios

- NodeJS
    - [SharePoint App Registration (App-Only)](./server-nodejs.md#sharepoint-app-registration)
    - [ADAL (App-Only)](server-nodejs.md#adal)
    - [MSAL (App-Only)](server-nodejs.md#msal) - coming soon
