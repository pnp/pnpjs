![SharePoint Patterns and Practices Logo](https://devofficecdn.azureedge.net/media/Default/PnP/sppnp.png)

PnPjs is a fluent JavaScript API for consuming SharePoint and Office 365 REST APIs in a type-safe way. You can use it with SharePoint Framework, Nodejs, or JavaScript projects. This an open source initiative complements existing SDKs provided by Microsoft offering developers another way to consume information from SharePoint and Office 365.

Please use [http://aka.ms/sppnp](http://aka.ms/sppnp) for the latest updates around the whole *SharePoint Patterns and Practices (PnP) program*.

## General Guidance

These articles provide general guidance for working with the libraries. If you are migrating from _sp-pnp-js_ please review the [transition guide](documentation/transition-guide.md).

* **[Getting Started](documentation/getting-started.md)**
* [Getting Started Contributing](documentation/getting-started-dev.md)
* [Gulp Commands](documentation/gulp-commands.md)
* [Debugging](documentation/debugging.md)
* [Deployment](documentation/deployment.md)
* [Install Beta Versions](documentation/beta-versions.md)
* [Polyfills](documentation/polyfill.md)
* [Package Structure](documentation/package-structure.md)

## Packages

The following packages comprise the Patterns and Practices client side libraries. All of the packages are published as a set and depend on their peers within
the @pnp scope.

The latest published version is **{{version}}**.

|     ||  | 
| ---| -------------|-------------|
| @pnp/| | | 
|| [common](common/docs/index.md)  | Provides shared functionality across all pnp libraries | 
|| [config-store](config-store/docs/index.md) | Provides a way to manage configuration within your application | 
|| [graph](graph/docs/index.md) | Provides a fluent api for working with Microsoft Graph |
|| [logging](logging/docs/index.md) | Light-weight, subscribable logging framework |
|| [nodejs](nodejs/docs/index.md) | Provides functionality enabling the @pnp libraries within nodejs |
|| [odata](odata/docs/index.md) | Provides shared odata functionality and base classes |
|| [pnpjs](pnpjs/docs/index.md) | Rollup library of core functionality (mimics sp-pnp-js) |
|| [sp](sp/docs/index.md) | Provides a fluent api for working with SharePoint REST |
|| [sp-addinhelpers](sp-addinhelpers/docs/index.md) | Provides functionality for working within SharePoint add-ins |
|| [sp-clientsvc](sp-clientsvc/docs/index.md) | Provides based classes used to create a fluent api for working with SharePoint Managed Metadata |
|| [sp-taxonomy](sp-taxonomy/docs/index.md) | Provides a fluent api for working with SharePoint Managed Metadata |

## Issues, Questions, Ideas

Please [log an issue](https://github.com/pnp/pnpjs/issues) using our template as a guide. This will let us track your request and ensure we respond. We appreciate any
contructive feedback, questions, ideas, or bug reports with our thanks for giving back to the project.


## Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

### "Sharing is Caring"

### Disclaimer
**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
