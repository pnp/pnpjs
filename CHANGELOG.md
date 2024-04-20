# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 4.0.0 - 2023-Nov-11

### Added

- graph
  - explicit error thrown if SPFx context is null or undefined when needed
  - followed sites support for users
  - ISite now supports `async rebase()` to ensure any ISite is represented by the url pattern /sites/{site id} regardless of how it was first loaded
  - ISites.getAllSites()
  - support for operations for ISite and IList
  - support for file labels
  - support for mail folders, mailbox, rules
  - completed support for Files
  - admin module
  - analytics module
  - appCatalog module
  - compliance module
  - list-item module
  - mail module
  - operations module
  - permissions module
  - places module
  - taxonomy module
  - to-do module

- sp
  - explicit error thrown if SPFx context is null or undefined when needed
  - getStream method on all readable files
  - addChunked updated to accept stream as content, new signature with props object

### Removed

- queryable
  - removed [extension](https://pnp.github.io/pnpjs/queryable/extensions/) capabilities from core library

- graph
  - paged method removed from IGraphQueryableCollection
  - ./operations.ts methods moved to ./graphqueryable.ts
  - deprecated DriveItem move method.
  - deprecated DriveItem setContent method.
  - `data` & [queryable] property on add/update methods -- now returns only a representation of the added/updated object

- sp
  - getPaged method removed from _Items/IItems
  - PagedItemCollection removed from library
  - removed /items/get-all import, unneeded, use async iterator patterns
  - ./operations.ts methods moved to ./spqueryable.ts
  - startUpload, continueUpload, finishUpload File protected methods removed
  - removed legacy support for @target query param
  - removed "favorites", please use graph favorites
  - taxonomy module, please use graph taxonomy
  - `data` & [queryable] property on add/update methods -- now returns void

- nodejs
  - removed stream extensions, moved into sp

### Changed

- tsconfig.json
  - set preserveConstEnums: false

- buildsystem
  - Rewritten using Timeline
  - Updated to v4

- testing
  - SPA application now has a button to trigger the code vs running on page load

- msaljsclient
  - updated to use @azure/msal-browser v3

- queryable
  - moved add-props.ts and request-builders.ts to index.ts
  - Changed interface for `query` property

- graph
  - IGraphQueryableCollection now supports async iterator pattern
  - IGraphQueryableCollection count method now returns -1 if the collection does not support counting
  - All GraphQueryable*, _GraphQueryable*, and IGraphQueryable* have been renamed to remove "Queryable" (ex: GraphQueryableCollection is now GraphCollection)
  - @pnp/graph/onedrive renamed to @pnp/graph/files
  - ISites.getByUrl is now async
  - @pnp/graph/outlook is now in @pnp/graph/mail, included all mail endpoints
  - mailCategory.add() returns Microsoft Graph types OutlookCategory vs object with data property.
  - Changed how query params are parsed to custom logic
  - Improvements to shared module
  - Greatly expanded what is supported through teams module
  
- sp
  - _Items and IItems now supports async iterator pattern
  - chunked upload/add progress object shape changed to : { uploadId: string; stage: "starting" | "continue" | "finishing"; offset: number; }
