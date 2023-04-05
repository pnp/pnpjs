# Custom Bundling

With the introduction of [selective imports](./selective-imports.md) it is now possible to create your own bundle to exactly fit your needs. This provides much greater control over how your solutions are deployed and what is included in your bundles.

Scenarios could include:

- Deploying a company-wide PnPjs custom bundle shared by all your components so it only needs to be downloaded once.
- Creating SPFx libraries either for one project or a single webpart.
- Create a single library containing the PnPjs code you need bundled along with your custom [extensions](../queryable/extensions.md).

## Create a custom bundle

### Webpack

You can see/clone a [sample project of this example here](https://github.com/pnp/pnpjs/tree/version-3/samples/custom-bundle-webpack).
