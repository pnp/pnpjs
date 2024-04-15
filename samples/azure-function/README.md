# PnPjs - Azure Function v4 Support

This sample project demonstrates how to use the PnPjs SDK inside of an Azure Function v4 with Application Insights, one of the most common scenarios when building extensibility solutions for Microsoft 365.

By default Azure Functions are configured to use Node.js CommonJS modules. However, PnPjs only supports ESModules. This sample shows you how to reconfigure your solution so that you can use ESModules and import any other CommonJS  modules that you have as dependencies.

## List of changes

- tsconfig.json: [Intro to TSConfig Reference](https://www.typescriptlang.org/tsconfig)
  - "module": "ESNext"
  - "target": "ESNext"
  - "moduleResolution": "Node"
  - "allowSyntheticDefaultImports": true
  
- package.json
  - "type": "module"

## Importing CommonJS packages

With these settings updated we can now import our CommonJS packages by using

`import AppInsights from 'applicationinsights';`

instead of

`let appInsights = require('applicationinsights');`

## Azure Identity

Azure Identity is an SDK that provides Microsoft Entra ID (formerly Azure Active Directory - Azure AD) token authentication through a set of convenient TokenCredential implementations. [More information](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/README.md)

This sample implements PnPjs security expecting Managed Identity has been configured for the Azure Function.

> We find the [CLI for Microsoft 365](https://pnp.github.io/cli-microsoft365/) - [entra approleassignment add](https://pnp.github.io/cli-microsoft365/cmd/entra/approleassignment/approleassignment-add) especially handy for assigning the permissions necessary to your Azure Functions' system-managed identity.

When in local development mode you can log into Azure by including the Azure Account extension for Visual Studio Code, or preferably you can configure 3 additional settings in your [local.settings.json](./local.settings.example.json) file to point to an Entra ID App Registration in your development tenant using Certificate authentication.

```JSON
"AZURE_CLIENT_ID": "99999999-9999-9999-9999-999999999999",
"AZURE_TENANT_ID": "99999999-9999-9999-9999-999999999999",
// path to .pem file that is the companion the app registration certificate.
"AZURE_CLIENT_CERTIFICATE_PATH":"c:\\cert.pem"
```

See the more information link above for other supported authentication scenarios like Client Secret and Certificate. Be aware many SharePoint endpoint do not support Client Secret authentication.

## Application Insights

Azure Application Insights monitors your backend services and components after you deploy them to help you discover and rapidly diagnose performance and other issues. Add this SDK to your Node.js services to include deep info about Node.js processes and their external dependencies such as database and cache services. You can use this SDK for your Node.js services hosted anywhere: your datacenter, Azure VMs and Web Apps, and even other public clouds.

To get [more information](https://github.com/microsoft/ApplicationInsights-node.js#readme) on Application Insights.
