# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 3.0.0 - 20XX-XXXX-XX

### Fixed


### Added

- Introduced "Timeline" concept and supporting code with moments

- common:
  - delay utility function

### Changed

- Renamed package "odata" -> "queryable"
- Renamed package "common" -> "core"

- sp:
  - web.update return changed to Promise<void>
  - web.getParentWeb return changed to Promise<IWeb>
  - moved items.getAll to seperate import @pnp/sp/items/get-all
  - files.getByName => files.getByUrl
  - folders.getByName => folders.getByUrl

### Removed

- queryable:
  - LambdaParser -> write an observer
  - TextParser, BlobParser, JSONParser, BufferParser -> TextParse, BlobParse, JSONParse, BufferParse behaviors
  - Removed .get method in favor of invokable pattern. foo.get() => foo()
  - Removed .clone, .cloneTo in favor of using factories directly, i.e. this.clone(Web, "path") => Web(this, "path")
  - Invokable Extensions is split, with core object extension functionality moved to core
  - ensureHeaders => headers = { ...headers, ...newValues }

- nodejs: 
  - AdalCertificateFetchClient, AdalFetchClient, MsalFetchClient, SPFetchClient, ProviderHostedRequestContext -> use MSAL behavior
  - BearerTokenFetchClient -> use @pnp/Queryable BearerToken behavior
  - SPFetchClient -> Use SPNodeFetch which includes SP retry logic

- common/core:
  - Removed global extensions in favor of instance or factory. Global no longer aligned to our scoped model
  - Removed util method assign use Object.assign or { ...a, ...b}
  - Removed util method getCtxCallback
  - Removed ITypedHash => built in type Record

- sp:
  - Removed createBatch from Site, use web.createBatch or sp.createBatch
  - feature.deactivate => use features.remove
  - getTenantAppCatalogWeb moved from root object to IWeb when imported
  - removed use of ListItemEntityTypeFullName in item add/update and removed associated methods to get the value\
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
  - removed folder.copyTo => folder.copyByPath
  - removed folder.moveTo => folder.moveByPath
  - removed _SPInstance._update => refactored and unused
