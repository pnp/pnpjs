# Nightly Builds

Starting with version 3 we support nightly builds, which are built from the version-3 branch each evening and include all the changes merged ahead of a particular build. These are a great way to try out new features before a release, or get a fix or enhancement without waiting for the monthly builds.

You can install the nightly builds using the below examples. While we only show examples for `sp` and `graph` nightly builds are available for all packages.

### SP

```CMD
npm install @pnp/sp@v3nightly --save
```

### Microsoft Graph

```CMD
npm install @pnp/graph@v3nightly --save
```

> Nightly builds are NOT monthly releases and aren't tested as deeply. We never intend to release broken code, but nightly builds may contain some code that is not entirely final or fully reviewed. As always if you encounter an issue [please let us know](https://github.com/pnp/pnpjs/issues), especially for nightly builds so we can be sure to address it before the next monthly release.
