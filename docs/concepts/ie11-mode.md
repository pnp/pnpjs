# IE11 Mode

Starting with v2 we have made the decision to no longer support IE11. Because we know this affects folks we have introduced IE11 compatibility mode. Configuring the library will allow it to work within IE11, however at a possibly reduced level of functionality depending on your use case. Please see the list below of known limitations.

## Limitations

When required to use IE11 mode there is certain functionality which may not work correctly or at all.

- Unavailable: [Extension Methods](./../odata/extensions.md)
- Unavailable: [OData Debugging](./../odata/debug.md)

## Configure IE11 Mode

To enable IE11 Mode set the ie11 flag to true in the setup object. Optionally, supply the context object when working in [SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview).

```TypeScript
import { sp } from "@pnp/sp";

sp.setup({
  // set ie 11 mode
  ie11: true,
  // only needed when working within SharePoint Framework
  spfxContext: this.context
});
```

> If you are supporting IE 11, please see the article on required [polyfills](./polyfill.md).

## A note on ie11 mode and support

Because IE11 is no longer a primary supported browser our policy moving forward will be doing our best not to break anything in ie11 mode, but not all features will work and new features may never come to ie11 mode. Also, if you find an ie11 bug we expect you to work with us on helping to fix it. If you aren't willing to invest some time to support an old browser it seems we shouldn't either.
