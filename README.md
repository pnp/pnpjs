![SharePoint Patterns and Practices](https://devofficecdn.azureedge.net/media/Default/PnP/sppnp.png)

The SharePoint Patterns and Practices client side libraries were created to help enable developers to do their best work, without worrying about the exact
REST api details. Built with feedback from the community they represent a way to simplify your day-to-day dev cycle while relying on tested and proven
patterns.

Please use [http://aka.ms/sppnp](http://aka.ms/sppnp) for the latest updates around the whole *SharePoint Patterns and Practices (PnP) initiative*.

**If you are moving from sp-pnp-js please review the [transition guide](docs-src/transition-guide.md)**

## Pre-release Beta Note

The software packages within this repo are currently pre-release and should be treated as beta versions. Please check them out and feel free to install them for use in non-production projects. We have documentation, samples, and guides coming - but for now have a look around and try things out.

The following gulp commands are currently working: build, package, test, lint, serve, and clean. Additionally F5 debugging works with ./debug/launch/main.ts - which can easily be modified to call other files.

Have a look around and let us know what you think :)

**Don't forget to install from the beta channel for latest available updates:**

`npm i @pnp/logging@beta @pnp/common@beta @pnp/odata@beta @pnp/sp@beta`

## Documentation

Please review the [github pages site](https://pnp.github.io/pnp/) containing the full documenation for the SharePoint Patterns and Practices Client Side libraries. This
site is updated with each release.

## Packages

The following packages comprise the Patterns and Practices client side libraries. Please see the [documentation](https://pnp.github.io/pnp/) for details.

### [@pnp/common](packages/common/docs/index.md) [![npm version](https://badge.fury.io/js/%40pnp%2Fcommon.svg)](https://badge.fury.io/js/%40pnp%2Fcommon)

**Provides shared functionality across all pnp libraries**

### [@pnp/config-store](packages/config-store/docs/index.md) [![npm version](https://badge.fury.io/js/%40pnp%2Fconfig-store.svg)](https://badge.fury.io/js/%40pnp%2Fconfig-store)

**Provides a way to manage configuration within your application**

### [@pnp/graph](packages/graph/docs/index.md) [![npm version](https://badge.fury.io/js/%40pnp%2Fgraph.svg)](https://badge.fury.io/js/%40pnp%2Fgraph)

**Provides functionality to query the Microsoft Graph**

### [@pnp/logging](packages/logging/docs/index.md) [![npm version](https://badge.fury.io/js/%40pnp%2Flogging.svg)](https://badge.fury.io/js/%40pnp%2Flogging)

**Light-weight, subscribable logging framework**

### [@pnp/nodejs](packages/nodejs/docs/index.md) [![npm version](https://badge.fury.io/js/%40pnp%2Fnodejs.svg)](https://badge.fury.io/js/%40pnp%2Fnodejs)

**Provides functionality enabling the @pnp libraries within nodejs**

### [@pnp/odata](packages/odata/docs/index.md) [![npm version](https://badge.fury.io/js/%40pnp%2Fodata.svg)](https://badge.fury.io/js/%40pnp%2Fodata)

**Provides shared odata functionality and base classes**

### [@pnp/pnpjs](packages/pnpjs/docs/index.md) [![npm version](https://badge.fury.io/js/%40pnp%2Fpnpjs.svg)](https://badge.fury.io/js/%40pnp%2Fpnpjs)

**Rollup library of core functionality (mimics sp-pnp-js)**

### [@pnp/sp](packages/sp/docs/index.md) [![npm version](https://badge.fury.io/js/%40pnp%2Fsp.svg)](https://badge.fury.io/js/%40pnp%2Fsp)

**Provides a fluent api for working with SharePoint REST**

### [@pnp/sp-addinhelpers](packages/sp-addinhelpers/docs/index.md) [![npm version](https://badge.fury.io/js/%40pnp%2Fsp-addinhelpers.svg)](https://badge.fury.io/js/%40pnp%2Fsp-addinhelpers)

**Provides functionality for working within SharePoint add-ins**

### Authors
This project's contributors include Microsoft and [community contributors](AUTHORS). Work is done as as open source community project.

### Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

### "Sharing is Caring"

### Disclaimer
**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

![](https://telemetry.sharepointpnp.com/pnp/pnp/readme.md)
