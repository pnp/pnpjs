![SharePoint Patterns and Practices Logo](https://raw.githubusercontent.com/pnp/media/master/pnp-logos-sp/png/1x/SharePoint_PnP_mark_fullcolor.png)

PnPjs is a collection of fluent libraries for consuming SharePoint, Graph, and Office 365 REST APIs in a type-safe way. You can use it within SharePoint Framework, Nodejs, or any JavaScript project. This an open source initiative and we encourage contributions and constructive feedback from the community.

![Fluent API in action](img/PnPJS_FluentAPI.gif)

_Animation of the library in use, note intellisense help in building your queries_

## General Guidance

These articles provide general guidance for working with the libraries. If you are migrating from v1 please review the [transition guide](transition-guide.md).

* **[Getting Started](getting-started.md)**
* [Authentication](./authentication/index.md)
* [Get Started Contributing](./contributing/index.md)
* [npm scripts](npm-scripts.md)
* [Polyfills](concepts/polyfill.md)

## Packages

Patterns and Practices client side libraries (PnPjs) are comprised of the packages listed below. All of the packages are published as a set and depend on their peers within the @pnp scope.

The latest published version is [![npm version](https://badge.fury.io/js/%40pnp%2Fcommon.svg)](https://badge.fury.io/js/%40pnp%2Fcommon).

|     ||  |
| ---| -------------|-------------|
| @pnp/| | |
|| [adaljsclient](./authentication/adaljsclient.md)  | Provides an adaljs wrapper suitable for use with PnPjs |
|| [common](./common/index.md)  | Provides shared functionality across all pnp libraries |
|| [config-store](./config-store/index.md) | Provides a way to manage configuration within your application |
|| [graph](./graph/index.md) | Provides a fluent api for working with Microsoft Graph |
|| [logging](./logging/index.md) | Light-weight, subscribable logging framework |
|| [msaljsclient](./authentication/msaljsclient.md)  | Provides an msal wrapper suitable for use with PnPjs |
|| [nodejs](./nodejs/index.md) | Provides functionality enabling the @pnp libraries within nodejs |
|| [odata](./odata/index.md) | Provides shared odata functionality and base classes |
|| [sp](./sp/index.md) | Provides a fluent api for working with SharePoint REST |
|| [sp-addinhelpers](./sp-addinhelpers/index.md) | Provides functionality for working within SharePoint add-ins |

## Authentication

We have a new section dedicated to helping you [figure out the best way to handle authentication](./authentication/index.md) in your application, check it out!

## Issues, Questions, Ideas

Please [log an issue](https://github.com/pnp/pnpjs/issues) using our template as a guide. This will let us track your request and ensure we respond. We appreciate any constructive feedback, questions, ideas, or bug reports with our thanks for giving back to the project.

## Changelog

Please review the [CHANGELOG](https://github.com/pnp/pnpjs/blob/main/CHANGELOG.md) for release details on all library changes.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

### "Sharing is Caring"

Please use [http://aka.ms/sppnp](http://aka.ms/sppnp) for the latest updates around the whole *SharePoint Patterns and Practices (PnP) program*.

### Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
