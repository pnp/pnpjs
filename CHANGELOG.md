# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 3.0.0 - 20XX-XXXX-XX

### Fixed

### Added

- common/core:
  - Introduced "Timeline" concept with Timline, moments, and observers
  - delay utility function

- logging
  - new PnPLogging behavior to integrate with new model

### Changed

- Renamed package "odata" -> "queryable"
- Renamed package "common" -> "core"

- logging:
  - listeners are now factory functions (new ConsoleListener() => ConsoleListener()), drop the 'new'
  - Console listener now supports pretty printing options with colors and improved formatting (@thechriskent)

- core:
  - improved typings on isArray such that TS understands the outcome and properly types arrays

- queryable:
  - changed constructor to also accept a tuple of [queryable, string] to allow easy rebasing of url while inheriting observers

- sp:
  - Renamed export "sp" -> "spfi" with type SPFI
  - Changed to using minimal metadata for all requests
  - web.update return changed to `Promise<void>`
  - web.getParentWeb return changed to `Promise<IWeb>`
  - moved items.getAll to seperate import @pnp/sp/items/get-all
  - files.getByName => files.getByUrl
  - folders.getByName => folders.getByUrl
  - fields.add* methods now take title and a single props object with the additional properties for each field
  - TimeZones.getById no merges the object & data
  - renamed search.execute => search.run due to naming conflict in new base classes
  - renamed suggest.execute => suggest.run due to naming conflict in new base classes
  - renamed sitedesigns.execute => sitedesigns.run due to naming conflict in new base classes
  - renamed sitescripts.execute => sitescripts.run due to naming conflict in new base classes
  - odataUrlFrom moved to utils folder
  - getParent signature change, path is second param, baseUrl is third param and only supports string
  - removed "core" preset
  - Improved web and site contructor to correctly rebase the web/site urls regardless of the url supplied (i.e. create a web from any sp queryable)
  - Renamed property in IItemUpdateResultData to "etag" from "odata.etag" to make it .etag vs ["odata.etag"]

- graph:
  - Renamed export "graph" -> "graphfi" with type GraphFI
  
### Removed

- logging
  - None of the other packages reference logging anymore, removing a dependency, logging still exists and can be used in your project as before and easily with the new model

- queryable:
  - LambdaParser -> write an observer
  - TextParser, BlobParser, JSONParser, BufferParser -> TextParse, BlobParse, JSONParse, BufferParse behaviors
  - Removed .get method in favor of invokable pattern. foo.get() => foo()
  - Removed .clone, .cloneTo in favor of using factories directly, i.e. this.clone(Web, "path") => Web(this, "path")
  - Invokable Extensions is split, with core object extension functionality moved to core
  - ensureHeaders => headers = { ...headers, ...moreHeaders }

- nodejs: 
  - AdalCertificateFetchClient, AdalFetchClient, MsalFetchClient, SPFetchClient, ProviderHostedRequestContext -> use MSAL behavior
  - BearerTokenFetchClient -> use @pnp/Queryable BearerToken behavior
  - SPFetchClient -> Use SPNodeFetch which includes SP retry logic

- core (common):
  - Removed global extensions in favor of instance or factory. Global no longer aligned to our scoped model
  - Removed `assign` util method use Object.assign or { ...a, ...b}
  - Removed `getCtxCallback` util method
  - Removed ITypedHash => built in type Record<string, *>
  - removed `sanitizeGuid` util method, wasn't used

- graph:
  - setEndpoint removed => .using(EndPoint("v1.0")) | .using(EndPoint("beta"))

- sp:
  - Removed createBatch from Site, use web.batched or sp.batched
  - feature.deactivate => use features.remove
  - getTenantAppCatalogWeb moved from root object to IWeb when imported
  - removed use of ListItemEntityTypeFullName in item add/update and removed associated methods to get the value
  - removed folders.add => folders.addUsingPath
  - removed folder.serverRelativeUrl property => use select
  - removed web.getFolderByServerRelativeUrl => web.getFolderByServerRelativePath
  - removed files.add => files.addUsingPath
  - removed file.copyTo => file.copyByPath
  - removed file.moveTo => file.moveByPath
  - removed version.delete => versions.deleteById
  - removed web.getFileByServerRelativeUrl => web.getFileByServerRelativePath
  - removed folder.contentTypeOrder => use .select("contentTypeOrder")
  - removed folder.uniqueContentTypeOrder => use .select("uniqueContentTypeOrder")
  - removed folder.copyTo => use folder.copyByPath
  - removed folder.moveTo => use folder.moveByPath
  - removed _SPInstance._update => refactored and unused
  - removed objectToSPKeyValueCollection
  - removed toAbsoluteUrl => use behaviors
  - removed IUtilities.createWikiPage
  - removed searchWithCaching, use caching behavior
  - removed spODataEntity and spODataEntityArray
  - removed attachments addMultiple, deleteMultiple, and recycleMultiple => write a for loop in calling code
  - removed regional settings.installedLanguages => use getInstalledLanguages
  - removed metadata method

- sp-addinhelpers
  - Dropped entire package, no longer needed
  