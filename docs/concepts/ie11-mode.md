# IE11 Mode

Starting with v2 we have made the decision to no longer support IE11. Because we know this affects folks we have introduced IE11 compatibility mode. Using this mode will remove certain features from the library, such as the ability to [invoke](./invokable.md) method chains.

> If you are supporting IE 11, please see the article on [polyfills](./polyfill.md).

```TypeScript
import { sp } from "@pnp/sp";

sp.setup({
  // set ie 11 mode
  ie11: true,
  // only needed when working within SharePoint Framework
  spfxContext: this.context
});
```

## A note on ie11 mode and support

Because IE11 is no longer a primary supported browser our policy moving forward will be doing our best not to break anything in ie11 mode, but not all features will work and new features may never come to ie11 mode. Also, if you find an ie11 bug we expect you to work with us on helping to fix it. If you aren't willing to invest some time to support an old browser it seems we shouldn't either.
