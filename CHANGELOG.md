# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 4.8.0 - 2024-Dec-23

- graph
  - Fixed issue with resumableUpload

- nodejs
  - Removed node-fetch as minimum supported NodeJS version support native fetch.

- queryable
  - reversed removal of .clone()

## 4.7.0 - 2024-Nov-18

- sp
  - Introduces new filter lamda patterns as beta

- graph
  - Renamed OneNote Pages to OneNotePages
  - Basic Pages API support as beta
  - Site Open Extensions as beta
  - Fixed #3136 for improving paging support for query params

- queryable
  - Introduced DebugHeaders behavior

## 4.6.0 - 2024-Oct-14

- Only documentation and package updates

## 4.5.0 - 2024-Sept-16

- Only documentation and package updates

## 4.4.0 - 2024-Aug-12

- sp
  - Addresses #3091 - Update return types from Shares
  - Addresses #3104 - Replaces an in-function await to just return the promise.

- graph
  - Addresses #3083 - Adds the ability to pass in retrieveProperties to getAllChildrenAsTree. V2 and V3 had this functionality. Only supports Shared Custom Properties, not Local Custom Properties.

## 4.3.0 - 2024-July-15

- sp
  - Addresses #3082 - Improves functionality of alias parameters

- graph
  - Adds new AdvancedQuery behavior

## 4.2.0 - 2024-June-17

- Only documentation and package updates

## 4.1.1 - 2024-June-05

### Fixed

- graph
  - Fixed batching issues that fails when batched call returns 204

## 4.1.0 - 2024-May-24

### Fixed

- graph
  - Update to better handle graph default url logic

## 4.0.1 - 2024-Apr-23

### Fixed

- graph
  - Fixed issue with SPFx behavior null check #3012

## 4.0.0 - 2024-Apr-22

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
  - getAll method removed from _Items/IItems
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
