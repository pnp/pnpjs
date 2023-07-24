# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 3.17.0 - 2023-Jul-24

- sp/graph
  - Addresses #2716 - Fix for batching adding incorrect headers in certain circumstances

- graph
  - Addresses #2567 - Fixes issue with channel messages in teams.
  - Addresses #2677 - Removed analytics endpoint on drive root as it's not longer supported. V4 updates will include new analytics modules that will add more features.

- logging
  - Addresses #2731 - Fixed issues with browser console levels.

## 3.16.0 - 2023-Jun-9

### Fixed

- sp
  - Addresses #2681 - Fix for cannot read properties of undefined (reading 'prototype')
  - Addresses #2685 - Fix for multichoice field properties
  - Addresses #2688 - Fix for apostorphes in filename

### Added

- graph
  - Adds shares modules to graph library

## 3.15.0 - 2023-May-12

### Fixed

- timeline
  - Addresses #2669 - Adds code in Timeline emit to ensure we don't create empty observer arrays on the Timeline.observers container due to filtering for once.

- nodejs
  - Modified SPDefault and GraphDefault so empty object is not required.

- sp
  - Addresses #2646 - Issue with creating fields when batching.
  - Addresses #2661 - Adding BatchNever to Request-Digest Behavior when retrieving a new RequestDigest token.

- azidjsclient
  - Fix bug with caching in Azure Identity Client wrapper and improve key generation

## 3.14.0 - 2023-Apr-17

### Added

- sp
  - Added groupsitemanager module to help manage team sites.
  - Addresses #2565 - Adds a method to Sites to set the site logo vs web property update to set the site logo thumbnail
  - Addresses #2602 - adds a tenantAppcatalog property to the root sp object; ensures that web.appcatalog points to the sitecollection appcatalog

- azidjsclient
  - Added new azidjsclient package that supports Azure Identity, most useful for node-js development and managed identity

- node
  Update to node package GraphDefault and SPDefault package to make msal parameter optional (deprecated) and updated the documentation for new guidance on passing the MSAL (and AzureIdentity) auth methods as separate observerable on the using call.

### Fixed

- docs
  - Updated Taxonomy documentation to call out need for auth token on add/update/delete events.
  - Addresses #2604 - Updating Docs for Page Comments to include proper atMention functionality.

- general
  - Updated debug scenarios for spa to make debugging work with settings file.
  - Updated package-lock.json for SPFx debugging scenario to fix a bug

- sp
  - Addresses #2629 - Bug fix for missing quotes on sp recycle bin getById method.
  - Addresses #2615 - fixes a bug with batching and caching in graph where requests were not resolving correctly, the fix from Version 3 - launch prep 1 #2052 applied to graph lib

## 3.13.0 - 2023-Mar-17

### Added

- sp
  - Added getCurrentUserMemberships to new publishingSitePageService import.

### Fixed

- node
  - Fixed typing issues with asCanceable wrapper and dropped references in stream.d.ts.
  - Fixed setStreamContentChunked to fixed unhandled promise.

## 3.12.1 - 2023-Feb-14

### Fixed

- sp
  - Addresses #2570, #2571 - Removes adding a bearer token by default to SPFx requests

## 3.12.0 - 2023-Feb-10

**Please note:** We are official closing support for v2. Moving forward we will no longer do releases for the v2 version.

### Added 

- graph
  - Addresses #2552 - Adds an SPFx Token behavior to sp and graph libraries

- sp
  - Addresses #2552 - Adds an SPFx Token behavior to sp and graph libraries
  - Addresses #2551 - Add typings when fetching Site data and change typings for getDocumentLibraries

### Fixed

- core
  - Fixes #2539 - Fix unhandlable promise in start()

- sp
  - Fixes #2561 - Changes behavior in processing for saving client side pages to process all controls through the specialSaveHandling function
  - Fixes #2558 - Issue with getParentWeb from root site
  - Fixes #2550 - Fix for request digest timeout after tab sleeps

- sp-admin
  - Fixes #2518 - Replacing 'CreateGroupForSite' method example by 'AddTenantCdnOrigin'

## 3.11.0 - 2023-Jan-13

### Added

- graph
  - Added various methods to OneDrive module; GraphFI.Drives,Drives - delta,Drives - upload,Drive - getItemByPath,Drive - getItemsByPath,DriveItem - moveItem,DriveItem - copyItem,DriveItem - convertContent,DriveItem - upload,DriveItem - preview,Root/DriveItem - analytics,List - IDrive.getList

### Fixed

- docs
  - General typo fixes and updates

- core
  - Fixes #2507 - Updates the timeline start logic to get a ref to the promise rather than attaching finally directly.

- sp
  - Fixes #2509 - Fix but with item.setImageField

- node
  - Fixes #2532 - Fix setStreamContentChunked: await loading chunks

### Removed

- graph
  - Deprecated OneDrive module; DriveItem - move - replaced by moveItem, DriveItem - setContent - replaced by upload

## 3.10.0 - 2022-Dec-13

### Added

- queryable
  - Added CacheNever behavior
  - Adds bindCachingCore method to reuse the caching props calculation logic

- sp
  - Added ability to limit the getSharingInformation returned properties
  - Adding support for add/update/delete for taxonomy entities

- graph
  - Added followed endpoint to Drives
  - Adds options to Graph - OneDrive sharedWithMe method

### Fixed

- docs
  - General typo fixes and updates

- queryable
  - Fix for CachingPessimistic behavior

- sp
  - Fixing #2448 appears to have reverted #2414, and now fixed again

- graph
  - Bug fix for DrvieItem.getContent when using Caching behavior
  
## 3.9.0 - 2022-Nov-11

### Added

- sp
  - Support for multi-line batch responses

- graph
  - Add getting site by resource url instead of id

### Fixed

- docs
  - General typo fixes and updates

- sp
  - Updates Search and Suggest to be true invokable factories
  - Updates docs for search on using factory methods
  - Updates logic in sp.search and sp.searchSuggest
  - fix to await the completePromises in batches that have no requests due to caching supplying all the results.

- graph
  - This update includes a fix for an improperly formed search endpoint on the root drive.

## 3.8.0 - 2022-Oct-14

### Added

- sp
  - adds storage metrics for IFolder
  - adds return of IFolder or IFile from copyByPath and moveByPath
  - adds fileFromPath and fileFromAbsolutePath to get an IFile from arbitrary file paths
  - adds folderFromPath and folderFromAbsolutePath to get an IFolder from arbitrary file paths
  - adds ability to pass all options to IFolder's moveByPath and copyByPath to match IFile
  - adds docs/tests for the new stuff
  - adds a new sp module context-info allowing for easier retrieval of contextual information
  - adds new CacheAlways behavior
  - adds additional props to ISearchResult
  - adds additional props to site scripts create/update

### Fixed

- docs
  - General typo fixes
  - Fixed service class example

- graph
  - Fixed bug with getAllChildrenAsOrderedTree, #2414
  - Fixed issue with observables missing when adding drive item, #2435

## 3.7.0 - 2022-Sept-9

### Added

- docs
  - Updated getting started docs
- sp
  - added support for item rating
  - added support for favorite sites and items
- graph
  - added $search and $filter parameters to Count() and Paged Behavior

### Fixed

- docs
  - sample for ACS authentication
- sp
  - updated for escaping query strings
  - enchance copyByPath and moveByPath for sp/file allowing for passing all valid params

## 3.6.0 - 2022-Aug-16

### Fixed

- core
  - addresses #2222, #2356 - Updates to simplify url & query escaping
- sp
  - addresses #2372 - Fix bugs with sharing

### Added

- docs
  - added docs for Graph messages
  - update for getting started videos
  - update to docs around SPBrowser usage and setting baseUrl
- querable
  - new JSONHeaderParse behavior
- graph
  - addresses #2323 - Special Folder support
  - support for Lists, Columns, Content Types
- sp
  - update method for content types
  - addresses #2357 - add missing properties to IViewInfo typing

## 3.5.1 - 2022-July-13

### Fixed

- queryable
  - Error in SPFx due to tuple check in queryable constructor, adjusted check & added tests

## 3.5.0 - 2022-July-12

### Fixed

- docs
  - Documentation update for config/services setup
- graph
  - Addresses #2316 -  PR #2318 Remove specific encodeURIComponents to address double encoding.
  - PR #2319 - Added tests for certain graph queryable methods
- sp
  - Updates lists IRenderListDataParameters & RenderListDataOptions with new values not present originally
- queryable:
  - Beta 2 - Support for cancelling requests (see docs for known issues)
- behaviors
  - Fixes #2333 - PR #2344 Addresses issues with reviewing caching and batching.
  - Fixes #2329 - Argument of type 'WebPartContext' is not assignable to parameter of type 'ISPFXContext'.

### Added

- sp-admin
  - Added sp-admin library to support tenant admin APIs  

## 3.4.1 - 2022-June-13

### Fixed

- sp:
  - Addresses #2315 - PR #2233 addressed issues #2220 #2222 creating a breaking changed for the Safari (iOS) browser, this release reverses that change.

## 3.4.0 - 2022-June-10

### Fixed

- docs:
  - Various documentation updates
- general:
  - Major package version updates
  - Various test fixes
- sp:
  - Fields add() properties can be undefined bug
  - Fix issue with RequestDigest expiring when spfi is reinitialized.

### Added

- queryable:
  - Support for cancelling requests (beta - see docs for known issues)
- sp:
  - Added support for Recycle Bin/Second-Stage Recycle Bin
  - Added schedulePublished method for client-side pages
- graph:
  - Added support for paging
  - Added support for Bookings

## 3.3.2 - 2022-May-18

### Fixed

- package:
  - post-install.cjs fixes
-docs:
  - Various documentation updates

## 3.3.1 - 2022-May-17

### Fixed

- package:
  - post-install.cjs fixes

## 3.3.0 - 2022-May-16

### Fixed

- docs:
  - Various documentation updates
  - Fix for batch example in add multiple items to SharePoint list
  - Fix for documentation on getting site users

- graph:
  - Fixed bug in OneDrive package with Drive/getById
  - encodes the id provided to getById in graph lib to resolve issue with non-guid ids
  - fixes the addtional headers functionality in sendEmail in sp

- sp:
  - Addresses issue where created object in library was not getting observer refs supplied for files.addUsingPath
  - Fixed issue with search not caching results when using caching behavior
  - Added support for "X-PnP-CacheAlways" header to allow non-get requests to be cached correctly
  - Added Items property to IViewFilesInfo
  - Fixed issue where some objects created from urls were not getting observer refs
  - Added an exception if a queryable it executed with no registered observers and a docs entry to explain it

### Added

- sp:
  - Added getLockedByUser method on files

- graph:
  - Add chat message to Team channel

## 3.2.0 - 2022-April-08

### Fixed

- node:
  - Fix for CommonJS imports with ESM modules.

- sp:
  - Fix issue with sendEmail utility.
  - Bug fixes for getAllChildrenAsOrderedTree in Taxonomy.
  - Update for issues with stale requestdigest.
  - Bug fix for client-side pages for home page so that title is read from the json blob.
  - Remove user-agent header for throttling as no longer used.
  - Bug fix for renderListDataAsStream method

- graph:
  - Added getById method to Sites.
  - Added transitiveMemberOf method to User.
  - Added installedApps method to a Team.

- docs:
  - Various documentation copy/paste and typo fixes.
  - Updates for getting-started guidance for imports of both @pnp/sp and @pnp/graph in SPFx.
  - Updates to remove documentation showing batching adding files; includes new tag on all areas of library that are not supported for batching.
  - New documentation for Graph to get SharePoint sites.
  - New doucmentation for updating a BCS field in SharePoint.
  - Added Graph memberOf and transitiveMemberOf properties.
  - Updated docs on the Web() method.

## 3.1.0 - 2022-March-11

- sp:
  - Update interface IFieldInfo to include "Choices"
  - Fix getAllChildrenAsOrderedTree retrieve properties
  - Fix naming of getEditProfileLink and getIsMyPeopleListPublic in Profiles

- docs:
  - Updates to transition guide, getting started, authentication, and fixes for graphUrls, etc

## 3.0.3 - 2022-March-3

- sp:
  - Issues preventing search queries from running. #2124

## 3.0.2 - 2022-Feb-22

- sp:
  - Issue in SPFx behavior with improperly using current web's request digest for non-current web calls #2102

- docs:
  - Updates based on feedback
  - Sample updates for v3

## 3.0.1 - 2022-Feb-15

- sp:
  - Fixed root property initializers #2082

## 3.0.0 - 2022-Feb-14

### Added

- common/core:
  - Introduced "Timeline" concept with Timline, moments, and observers
  - delay utility function

- logging:
  - new PnPLogging behavior to integrate with new model

### Changed

- Renamed package "odata" -> "queryable"
- Renamed package "common" -> "core"

- logging:
  - listeners are now factory functions (new ConsoleListener() => ConsoleListener()), drop the 'new'
  - Console listener now supports pretty printing options with colors and improved formatting (@thechriskent)

- core:
  - improved typings on utility methods such that TS understands the outcome and properly types results

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
  - None of the other packages reference logging anymore, removing a dependency, logging still exists and can be used in your project as before and easily with the new behaviors model

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
  - Removed `sanitizeGuid` util method, wasn't used
  - Removed automatic cache expired item flushing -> use a timeout, shown in docs

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

- sp-addinhelpers:
  - Dropped entire package, no longer needed

- config-store:
  - Dropped entire package.
  
