# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 4.0.0 - 2023-Nov-11

### Fixed

- graph
  - limitation on chaining site operations from sites.getByUrl

### Added

- graph
  - explict error thrown if SPFx context is null or undefined when needed
  - followed sites support for users
  - ISite now supports `async rebase()` to ensure any ISite is represented by the url pattern /sites/{site id} regardless of how it was first loaded
  - ISites.getAllSites()
  - support for operations for ISite and IList

- sp
  - explict error thrown if SPFx context is null or undefined when needed

### Removed

- graph
  - paged method removed from IGraphQueryableCollection
  - ./operations.ts methods moved to ./graphqueryable.ts

- sp
  - getPaged method removed from _Items/IItems
  - PagedItemCollection removed from library
  - removed /items/get-all import, unneeded, use async iterator patterns
  - ./operations.ts methods moved to ./spqueryable.ts

### Changed

- queryable
  - moved add-props.ts and request-builders.ts to index.ts

- graph
  - IGraphQueryableCollection now supports async iterator pattern
  - IGraphQueryableCollection count method now returns -1 if the collection does not support counting
  - All GraphQueryable*, _GraphQueryable*, and IGraphQueryable* have been renamed to remove "Queryable" (ex: GraphQueryableCollection is now GraphCollection)
  - @pnp/graph/onedrive renamed to @pnp/graph/files
  - ISites.getByUrl is now async
  - mailCategory.add() returns Microsoft Graph types OutlookCategory vs object with data property.

- sp
  - _Items and IItems now supports async iterator pattern


