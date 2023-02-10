# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 2023-Feb-10

We are official closing support for v2. Moving forward we will no longer do releases for the v2 version.

## 2.15.0 - 2022-Dec-9

### Fixed

- all: Now using the newer adal-node version (0.2.3) to fix issue #2496

## 2.14.0 - 2022-Jul-12

## 2.13.0 - 2022-Mar-11

## 2.12.0 - 2022-Feb-11

### Fixed

- sp: Fix delete comment from page and list items [@NZainchkovskiy](https://github.com/NZainchkovskiy) [[PR](https://github.com/pnp/pnpjs/pull/2015)]
- all: Fixed build system mismatch error [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/2049)]
- all: fixed issue like in earlier commit 2a75991 and mentioned in issue #1737 [@RoelVB](https://github.com/RoelVB) [[PR](https://github.com/pnp/pnpjs/pull/2013)]
- docs: fixed missing await [@ravichandran-blog](https://github.com/ravichandran-blog) [[PR](https://github.com/pnp/pnpjs/pull/2018)]

## 2.11.0 - 2021-Nov-15

### Fixed

- sp: Fix setStreamContentChunked with v3 code #1914; ICommentInfo as Partial #1933 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1945)]

### Added

- graph: Add primary channel to a team #1855 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1945)]

### Changed

- docs: update webpack custom bundle sample [@JakeStanger](https://github.com/JakeStanger) [[PR](https://github.com/pnp/pnpjs/pull/1934)]

## 2.10.0 - 2021-Oct-15

### Fixed

- docs: fixed incorrect example in role definition [@Abderahman88](https://github.com/Abderahman88) [[PR](https://github.com/pnp/pnpjs/pull/1910)]
- graph: fixed bug with double quotes in search query [@juliemturner](https://github.com/juliemturner)
- sp: fixed bugs #1847, #1871 issue with setting images in web part and banner [@juliemturner](https://github.com/juliemturner)

## 2.9.0 - 2021-Sept-20

### Fixed

- graph: Fixes the $count query param by adding appropriate header [@JakeStanger](https://github.com/JakeStanger) [[PR](https://github.com/pnp/pnpjs/pull/1850)]

## 2.8.0 - 2021-Aug-13

### Fixed

- sp: Removed a call to .clone affecting batches in some cases #1837 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1839)]
- sp: fixes sharing for files, fixes bug in shareObject code path #1827 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1840)]
- docs: missing imports on OneDrive imports [@omarelanis](https://github.com/omarelanis) [[PR](https://github.com/pnp/pnpjs/pull/1843)]
- graph: Fixes add in DriveItems [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1845)]
- sp: ClientSide Pages: Always includes BannerImageUrl in save page payload to avoid null #1847 [@juliemturner](https://github.com/juliemturner)

### Added

- graph: Adds the $search query param for messages, people and directory objects [@JakeStanger](https://github.com/JakeStanger) [[PR](https://github.com/pnp/pnpjs/pull/1818)]
- graph: Adds new function to events to get all instances. [@JakeStanger](https://github.com/JakeStanger) [[PR](https://github.com/pnp/pnpjs/pull/1832)]
- sp: Add fields.addImageField, listitem.setImageField, item.getParentInfos returns "ParentList/Title" [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1839)]
- graph: Adds addFolder to DriveItems [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1845)]

## 2.7.0 - 2021-July-09

### Fixed

- docs: Optional params for lists renderListDataAsStream #1811, fix bad example for roleAssignments.remove #1820 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1824)]

## 2.6.0 - 2021-June-11

### Fixed

- graph: all preset missing outlook [@JakeStanger](https://github.com/JakeStanger) [[PR](https://github.com/pnp/pnpjs/pull/1766)]

### Added

- graph: user/calendar findrooms endpoint [@JakeStanger](https://github.com/JakeStanger) [[PR](https://github.com/pnp/pnpjs/pull/1729)]
- sp: ability to use sitecollection app catalogs [@JakeStanger](https://github.com/JakeStanger) [[PR](https://github.com/pnp/pnpjs/pull/1760)]
- sp: Client-side page improvements #1751 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1769)]

### Changed

- sp: Check if CorporateCatalogUrl before returning Web [@allanhvam](https://github.com/allanhvam) [[PR](https://github.com/pnp/pnpjs/pull/1774)]
- docs: Added examples showing how to access a term set [@mrebuffet](https://github.com/mrebuffet) [[PR](https://github.com/pnp/pnpjs/pull/1798)]

## 2.5.0 - 2021-May-14

### Fixed

- sp: sp.site.getContextInfo() compatible with SP2013 [@lukju](https://github.com/lukju) [[PR](https://github.com/pnp/pnpjs/pull/1716)]
- docs: fixed typeo in Files/types.ts [@AriGunawan](https://github.com/AriGunawan) [[PR](https://github.com/pnp/pnpjs/pull/1733)]
- docs: fixed typeo in debug-tests.md [@chimenjoku](https://github.com/chimenjoku) [[PR](https://github.com/pnp/pnpjs/pull/1736)]
- sp: Fix getting content type name in the proper language [@magarma](https://github.com/magarma) [[PR](https://github.com/pnp/pnpjs/pull/1753)]
- sp: searchUsingCaching where results shared a cache key so were not being updated #1678 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1730)]
- sp: Fixed issues with isolated runtimes not inheriting properly #1755 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1730)]

### Added

- docs: mention in docs for setEndpoint in graph library #1693 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1730)]
- sp: Adds an addRepostPage method with clientside-pages #1703 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1730)]

### Changed

- docs: Updates the nav docs to clear up some confusion #1694 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1730)]

## 2.4.0 - 2021-April-9

### Fixed

- sp: Fixed search query 'hitHighlightedProperties' property spelling [@ytasyol](https://github.com/ytasyol) [[PR](https://github.com/pnp/pnpjs/pull/1646)]
- sp: Fix client-side pages AuthorByline bug; various other testing/tooling updates  [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1648)]
- docs: Changelog typo [@viceice](https://github.com/viceice) [[PR](https://github.com/pnp/pnpjs/pull/1651)]
- docs: Add missing import [@AriGunawan](https://github.com/AriGunawan) [[PR](https://github.com/pnp/pnpjs/pull/1672)]
- docs: Add missing import [@ravichandran-blog](https://github.com/ravichandran-blog) [[PR](https://github.com/pnp/pnpjs/pull/1677)]
- docs: Testing/tooling updates  [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1679)]
- graph: Fixed addChunked file error with apostrophe #1645, #1659 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1684)]
- sp: Fixed MoveTo issue #1686 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1692)]

### Added

- graph: Added Graph User Presence endpoint & unit test fixes  [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1691)]

### Changed

- docs: Documentation Update Multi-line Text Field - Enhanced Rich Text [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1671)]

## 2.3.0 - 2021-March-12

### Fixed

- docs: typos [@PathToSharePoint](https://github.com/PathToSharePoint) [[PR](https://github.com/pnp/pnpjs/pull/1589)]
- graph: Fixed drive.getItemById #1559 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1589)]
- build: Changed default testing to MSAL auth #1564 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1589)]
- sp: fix for incorrect factory assignment for associated groups for web (SiteGroups vs SiteGroup) #1594 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1589)]
- graph: Fix graph typings #1615 [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1628)]
- sp: Fix issues with setDefaultColumnValues for folders #1637 [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1639)]
- build: Fixed isolated runtime bug in openWebById #1625 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1642)]
- build: fixing contructors for SPHttpClient and GraphHttpClient #1620 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1642)]
- build: resetting to es5 target #1619 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1642)]

### Added

- graph: Outlook master categories [@JakeStanger](https://github.com/JakeStanger) [[PR](https://github.com/pnp/pnpjs/pull/1548)]
- sp: adding copyTo method to clientside-page #1586 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1589)]
- graph: added graph manager and direct reports to user #1590 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1589)]
- build: Adds new testUser account to settings file to support debug and testing scenarios. #1512 [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1628)]
- sp: Added additional MoveOperation flags for moveTo #1623 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1642)]

### Changed

- docs: Full example for default column value for a taxonomy field [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1611)]

## 2.2.0 - 2021-Feb-12

### Fixed

- sp: getAllChildrenAsOrderedTree and root folder getItem bug fixes #1567, #1572 [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1584)]
- sp: Fix issue with setting TaxonomyFieldTypeMulti [@FredrikEkstroem](https://github.com/FredrikEkstroem)/[@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1568)]/[[PR](https://github.com/pnp/pnpjs/pull/1582)]

### Added

- docs: Added missing `addNumber()` method to IFields documentation [@gitbrent](https://github.com/gitbrent) [[PR](https://github.com/pnp/pnpjs/pull/1580)]

## 2.1.1 - 2021-Feb-01

### Changed

- sp: Updated docs to cover setting properties for clientside webparts [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1547)]

### Fixed

- sp: Fix issue with isolated runtimes and global headers [@tavikukko](https://github.com/tavikukko) [[PR](https://github.com/pnp/pnpjs/pull/1541)]
- sp: Fix issue with clientside-page like/unlike [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1546)]
- sp: Fix for taxonomy getAllChildrenAsOrderedTree method for terms without ordering information [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1547)]
- sp: Fix for setProxyUrl not using configured setting for some auth tasks [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1547)]

## 2.1.0 - 2021-Jan-15

### Added

- sp: Adds addChunked stream version for node [@koltyakov](https://github.com/koltyakov) [[PR](https://github.com/pnp/pnpjs/pull/1517)]
- general: Push tags on release #1484 [@pdecat](https://github.com/pdecat) [[PR](https://github.com/pnp/pnpjs/pull/1485)]
- general: Isolated Runtimes for sp and graph + node module updates [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1403)]
- graph: Graph search, getListItemEntityTypeFullName caching, and dev deps updates [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1510)]

### Changed

- docs: Fix graph group sample [@ravichandran-blog](https://github.com/ravichandran-blog) [[PR](https://github.com/pnp/pnpjs/pull/1527)]

### Fixed

- docs: Fix bug in settings.example [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1520)]
- sp: Bug fix for parser in creating teams & docs [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1520)]
- sp: validateUpdateListItem on file item ref doesn't work #1477 [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1520)]
- sp: Likes are not supported in this item #1498 [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1520)]
- docs: Minor documentation update [@ravichandran-blog](https://github.com/ravichandran-blog) [[PR](https://github.com/pnp/pnpjs/pull/1529)]

## 2.0.13 - 2020-Dec-14

### Added

- graph: Added new method to get the Team Site for a Group [@RamPrasadMeenavalli](https://github.com/RamPrasadMeenavalli) [[PR](https://github.com/pnp/pnpjs/pull/1446)]
- general: Adding MSAL support for local dev and tests, updating actions to use [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1454)]
- sp: Adds and updates for Taxonomy issues [@patrick-rodgers](https://github.com/patrick-rodgers) [[PR](https://github.com/pnp/pnpjs/pull/1465)]
- graph: Add create for teams endpoint, Adds team getOperationId, Updates cloneTeam response type [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1469)]

### Changed

- docs: Updated SPFx On-Prem & TypeScript (alternative) docs [@koltyakov](https://github.com/koltyakov) [[PR](https://github.com/pnp/pnpjs/pull/1473)]
- sp: Add NextHref prop in IRenderListDataAsStreamResult [@Leomaradan](https://github.com/Leomaradan) [[PR](https://github.com/pnp/pnpjs/pull/1453)]

### Fixed

- sp: Fixed issue with addChunked method [@tavikukko](https://github.com/tavikukko) [[PR](https://github.com/pnp/pnpjs/pull/1463)]
- docs: Updating methods for valid syntax [@bcameron1231](https://github.com/bcameron1231) [[PR](https://github.com/pnp/pnpjs/pull/1459)]
- docs: HubSite Documentation Fix [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1450)]
- docs: Spelling fix sp-app-registration.md [@RamPrasadMeenavalli](https://github.com/RamPrasadMeenavalli) [[PR](https://github.com/pnp/pnpjs/pull/1442)]
- docs: Spelling fix mkdocs.yml [@RamPrasadMeenavalli](https://github.com/RamPrasadMeenavalli) [[PR](https://github.com/pnp/pnpjs/pull/1441)]

## 2.0.12 - 2020-Nov-16

### Added

- sp: Adds new ClientSidePage.setBannerImageFromExternalUrl #1396 [[PR](https://github.com/pnp/pnpjs/pull/1419)]
- sp: Adds new getParentInfos to List, Folder, and Items [[PR](https://github.com/pnp/pnpjs/pull/1402)]
- sp: Adds ability to work with very large libraries with > 5000 files to Files.addChunked method #1424

### Changed

- sp: Updates ClientSideText adding additional `<p></p>` tags which are no longer needed. #1282 [[PR](https://github.com/pnp/pnpjs/pull/1419)]
- sp: Updates Folder methods (moveTo, moveByPath, copyTo, copyByPath) to remove dependency on `odata.id`. #1395 [@hohenp](https://github.com/hohenp) [[PR](https://github.com/pnp/pnpjs/pull/1402)]

### Fixed

- sp: Fixes issue renderListDataAsStream not passing in URL parameters #1414 [[PR](https://github.com/pnp/pnpjs/pull/1419)]
- graph: Fixes issue with multiple graph methods not honoring 'inBatch' #1411 [[PR](https://github.com/pnp/pnpjs/pull/1419)]
- sp: Fixes folder default values at library just working for first default value #1434 [@tavikukko](https://github.com/tavikukko) [[PR](https://github.com/pnp/pnpjs/pull/1436)]
- sp: Fix for issue setting taxonomy field default values for libs/folders #1426 [@tavikukko](https://github.com/tavikukko) [[PR](https://github.com/pnp/pnpjs/pull/1437)]

## 2.0.11 - 2020-Oct-09

### Added

- docs/sp: Address underlying api issue in #1383 by adding `known issue` tag [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1400)]
- node: Adds support for node MSAL client with docs, Likely addresses #1226 as well with introduction of modern msal support #1390 [[PR](https://github.com/pnp/pnpjs/pull/1409)]
- sp: Use string values for the BasePermission High and Low properties in SP RoleDef updates [@danwatford](https://github.com/danwatford) [[PR](https://github.com/pnp/pnpjs/pull/1393)]

### Changed

- docs/sp & graph: update taxonomy for change in beta endpoints #1359, #1378 & graph update for photos endpoint #1368 [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1384)]
- docs/graph: Update docs for calendars, contacts, directoryobjects, insights, invitations, onedrive, planner. Update @microsoft/microsoft-graph-types to 1.22.0  [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1398)]

### Fixed

- docs: Fix Microsoft 365 PnP logo [@thechriskent](https://github.com/thechriskent) [[PR](https://github.com/pnp/pnpjs/pull/1394)]
- sp: Fixes issue with ViewsLifeTime search property casing in name #1401 [[PR](https://github.com/pnp/pnpjs/pull/1409)]

## 2.0.10 - 2020-Sept-10

- packaging: update to include .map files in packages [[PR](https://github.com/pnp/pnpjs/pull/1371)]
- docs: update to docs for nodejs sp extensions [[PR](https://github.com/pnp/pnpjs/pull/1371)]
- sp: update how batch error handling is done [[PR](https://github.com/pnp/pnpjs/pull/1371)]
- nodejs: fix for nodejs-commonjs error in 2.0.9 [[PR](https://github.com/pnp/pnpjs/pull/1371)]
- odata: updates how extensions are managed when extending a factory [[PR](https://github.com/pnp/pnpjs/pull/1371)]

## 2.0.9 - 2020-Sept-04

### Added

- sp: Added support for deleteWithParameters for folder, file, and item [[PR](https://github.com/pnp/pnpjs/pull/1326)]
- sp: Adding support for file.Exists to handle errors #1320 [[PR](https://github.com/pnp/pnpjs/pull/1327)]
- sp: Adding support for AddSubFolderUsingPath #1340 [[PR](https://github.com/pnp/pnpjs/pull/1353)]
- nodejs: Add getStream support to Nodejs [@naugtur](https://github.com/naugtur) [[PR](https://github.com/pnp/pnpjs/pull/1259)]

### Changed

- Renaming all instances of master to main in scripts, docs, and code [[PR](https://github.com/pnp/pnpjs/pull/1334)]
- sp: Updates to adjust taxonomy support and docs to reflect changes in api [[PR](https://github.com/pnp/pnpjs/pull/1346)]

### Fixed

- docs/graph: Docs updates to address #1341, #1099, and updated graph typings version to 1.17.0 [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1343)]
- sp: Fixes an issue for users not using minimal meta-data where unpatched 2016 returns verbose results that caused an error in getParentWeb. [[PR](https://github.com/pnp/pnpjs/pull/1345)]
- docs/graph: Updated documentation and added Graph tests [@dcashpeterson](https://github.com/dcashpeterson) [[PR](https://github.com/pnp/pnpjs/pull/1350)]
- sp/graph: Bug fixes for #1337, #1349 [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1351)]
- sp/graph: Fix for #1330, fixing linting issues, update tests for client side pages [[PR](https://github.com/pnp/pnpjs/pull/1352)]

## 2.0.8 - 2020-Aug-07

### Added

- sp: Added custom SPHttpClient extensibility and docs [[PR](https://github.com/pnp/pnpjs/pull/1300)]
- graph: Added baseUrl [[PR](https://github.com/pnp/pnpjs/pull/1303)]
- graph: Added ability to pass the SPFx context directly to setup [[PR](https://github.com/pnp/pnpjs/pull/1303)]
- docs: Added article on library configuration [[PR](https://github.com/pnp/pnpjs/pull/1303)]

### Changed

- msal: Fixed type name spelling [@biste5](https://github.com/biste5) [[PR](https://github.com/pnp/pnpjs/pull/1322)]

### Fixed

- sp: Fixed issue with renderListDataAsStream when omitting overrideParameters [[PR](https://github.com/pnp/pnpjs/pull/1303)]
- docs: Various updates, improvements, and corrections [@dcashpeterson](https://github.com/dcashpeterson) [[PR](https://github.com/pnp/pnpjs/pull/1310)]

### Removed

- graph: Removed adaljslcient library dependency [[PR](https://github.com/pnp/pnpjs/pull/1303)]

## 2.0.7 - 2020-July-27

### Added

- graph: Added calendar endpoints and docs [@JakeStanger](https://github.com/JakeStanger) [[PR](https://github.com/pnp/pnpjs/pull/1246)]
- msaljsclient: Added a new client for MSAL in browser [[PR](https://github.com/pnp/pnpjs/pull/1266)]
- docs: Added a new article on error handling [[PR](https://github.com/pnp/pnpjs/pull/1273)]
- graph: Adds the calendarView method to calenders and users [[PR](https://github.com/pnp/pnpjs/pull/1293)]

### Changed

- docs: Moved contribution guide to its own section and expanded [[PR](https://github.com/pnp/pnpjs/pull/1296)]

### Fixed

- adaljsclient: Fixed bug in getToken [@jusper-dk](https://github.com/jusper-dk) [[PR](https://github.com/pnp/pnpjs/pull/1205)]
- sp: Fixed a bug in the role definition and graph planner task details when updating [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1227)]
- docs: Updated attachments.md [@cesarhoeflich](https://github.com/cesarhoeflich) [[PR](https://github.com/pnp/pnpjs/pull/1233)]
- docs: Updated views.md [@mikezimm](https://github.com/mikezimm) [[PR](https://github.com/pnp/pnpjs/pull/1242)]
- docs: Updated permissions.md [@Harshagracy](https://github.com/Harshagracy) [[PR](https://github.com/pnp/pnpjs/pull/1244)]
- docs: Fixed typos in comments-likes.md [@NZainchkovskiy](https://github.com/NZainchkovskiy) [[PR](https://github.com/pnp/pnpjs/pull/1245)]
- sp: Fixed uri encoding for select, expand, and orderby query params [[PR](https://github.com/pnp/pnpjs/pull/1267)]
- docs: Fixed typos in readme and docs/index.md [@Ashikpaul](https://github.com/Ashikpaul) [[PR](https://github.com/pnp/pnpjs/pull/1268)]
- docs: Fixed clientsite-pages.md typos and wording to make more clear [@MarkyDeParky](https://github.com/MarkyDeParky) [[PR](https://github.com/pnp/pnpjs/pull/1269)]
- sp: Fixed code comment typo in queryable.ts [@NZainchkovskiy](https://github.com/NZainchkovskiy) [[PR](https://github.com/pnp/pnpjs/pull/1270)]
- docs: Removed duplicate search menu item [@f1nzer](https://github.com/f1nzer) [[PR](https://github.com/pnp/pnpjs/pull/1272)]
- graph: Made setEndpoint public, adds back user.photo property [[PR](https://github.com/pnp/pnpjs/pull/1274)]
- sp: Fixed bug with setting profile photo [[PR](https://github.com/pnp/pnpjs/pull/1276)]
- docs: Fixed typos in file attachment docs [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1288)]
- docs: Fixed a typo in sites.md [@ravichandran-blog](https://github.com/ravichandran-blog) [[PR](https://github.com/pnp/pnpjs/pull/1292)]
- sp: Fixed issue updating certain field types due to non-matching type [[PR](https://github.com/pnp/pnpjs/pull/1297)]

## 2.0.6 - 2020-June-05

### Added

- sp: Adds read operations for v2.1 Taxonomy API [[PR](https://github.com/pnp/pnpjs/pull/1216)]
- sp: Adds support for setting client side page description [[PR](https://github.com/pnp/pnpjs/pull/1279)]
- sp: Adds support for setting client side page thumbnail [[PR](https://github.com/pnp/pnpjs/pull/1284)]

### Fixed

- docs: Added await to the searcher function in search factory. [@derhallim](https://github.com/derhallim) [[PR](https://github.com/pnp/pnpjs/pull/1201)]
- docs: Update comment line sentence in hubsites. [@ravichandran-blog](https://github.com/ravichandran-blog) [[PR](https://github.com/pnp/pnpjs/pull/1207)]
- docs: Change Warn to Warning in logger. [@ravichandran-blog](https://github.com/ravichandran-blog) [[PR](https://github.com/pnp/pnpjs/pull/1211)]
- docs: Change LogListener to ILogListener in logger. [@ravichandran-blog](https://github.com/ravichandran-blog) [[PR](https://github.com/pnp/pnpjs/pull/1212)]

## 2.0.5 - 2020-May-08

### Added

- graph: Added tests and docs for groups [@dcashpeterson](https://github.com/dcashpeterson) [[PR](https://github.com/pnp/pnpjs/pull/1181)]
- sp: Added method to check it site collection exists [@DRamalho92](https://github.com/DRamalho92) [[PR](https://github.com/pnp/pnpjs/pull/1173)]
- sp: Added suppot for setting banner image in clientside-page copy [[PR](https://github.com/pnp/pnpjs/pull/1193)]

### Changed

- sp: Made field type optional when updating a field [[PR](https://github.com/pnp/pnpjs/pull/1193)]
- polyfills: Allow selective import of polyfills [[PR](https://github.com/pnp/pnpjs/pull/1193)]

### Fixed

- graph: Fixed issue with directoy-objects return types [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1192)]
- docs: Updated graph teams article [@jaywellings](https://github.com/jaywellings) [[PR](https://github.com/pnp/pnpjs/pull/1190)]
- docs: Fixed nav node name for users link [@siddharth-vaghasia](https://github.com/siddharth-vaghasia) [[PR](https://github.com/pnp/pnpjs/pull/1182)]
- sp: Fixed missing delete method on fields [@tavikukko](https://github.com/tavikukko) [[PR](https://github.com/pnp/pnpjs/pull/1165)]
- sp: Fixed issue with search results if there are zero rows returned [[PR](https://github.com/pnp/pnpjs/pull/1193)]
- common: Fixed storage issue in node related to usingCaching [[PR](https://github.com/pnp/pnpjs/pull/1193)]
- sp: Fixed bug in searchWithCaching [[PR](https://github.com/pnp/pnpjs/pull/1193)]

## 2.0.4 - 2020-April-10

### Added

- graph: Added Graph Insights + documentation [@simonagren](https://github.com/simonagren) [[PR](https://github.com/pnp/pnpjs/pull/1089)]
- sp: Added support, docs, and tests for default column values [[PR](https://github.com/pnp/pnpjs/pull/1130)]
- sp: Added support for setting clientside page author field [[PR](https://github.com/pnp/pnpjs/pull/1133)]
- sp: Added support for executeSiteScriptAction on Site [[PR](https://github.com/pnp/pnpjs/pull/1135)]
- sp: Added support for accessing title and description resource on Web, List, Content Type, Field, and User Custom Action [[PR](https://github.com/pnp/pnpjs/pull/1138)]
- sp: Added support for additional site creation properties [[PR](https://github.com/pnp/pnpjs/pull/1141)]
- sp: Added support for getFileByUrl method on web [[PR](https://github.com/pnp/pnpjs/pull/1142)]
- sp: Added support to specify promoted state when creating or copying clientside pages [[PR](https://github.com/pnp/pnpjs/pull/1143)]

### Fixed

- sp: brought over a v1 change that was missed for getCurrentUserEffectivePermissions [@koltyakov](https://github.com/koltyakov) [[PR](https://github.com/pnp/pnpjs/pull/1079)]
- graph: fixed graph planner bucket edit and delete with etag [@JMTeamway](https://github.com/JMTeamway) [[PR](https://github.com/pnp/pnpjs/pull/1095)]
- docs: Add starting '/' on relative urls in files & folders docs [@joelfmrodrigues](https://github.com/joelfmrodrigues) [[PR](https://github.com/pnp/pnpjs/pull/1095)]
- sp: Fixed issue with absolute url when copy/moving files and folders by path [@joelfmrodrigues](https://github.com/joelfmrodrigues) [[PR](https://github.com/pnp/pnpjs/pull/1108)]
- sp: Fixed issue with Retry-After not being converted to milliseconds [@koltyakov](https://github.com/koltyakov) [[PR](https://github.com/pnp/pnpjs/pull/1113)]
- docs: Fixed imports for sp.profiles docs [@joelfmrodrigues](https://github.com/joelfmrodrigues) [[PR](https://github.com/pnp/pnpjs/pull/1116)]
- docs: Fixed storage entities docs to correctly ref IStorageEntity [@PaoloPia](https://github.com/PaoloPia) [[PR](https://github.com/pnp/pnpjs/pull/1118)]
- docs: Replaced a TODO with proper content [@hugoabernier](https://github.com/hugoabernier) [[PR](https://github.com/pnp/pnpjs/pull/1120)]
- docs: Fixed fields documentation [@AJIXuMuK](https://github.com/AJIXuMuK) [[PR](https://github.com/pnp/pnpjs/pull/1125)]
- sp: Fixed code to support accessing a safe global object regardless of environment [[PR](https://github.com/pnp/pnpjs/pull/1134)]
- docs: Fixed docs around comments imports [[PR](https://github.com/pnp/pnpjs/pull/1136)]
- sp: Fixed issue with null emphasis object in clientside pages [[PR](https://github.com/pnp/pnpjs/pull/1137)]
- docs: Added recycle method to docs for list item [[PR](https://github.com/pnp/pnpjs/pull/1139)]
- graph: Fixed issues with batching parsing and improved error handling [[PR](https://github.com/pnp/pnpjs/pull/1146)]
- docs: Fixed a bad link and replaced TODO's with content in web article [[PR](https://github.com/pnp/pnpjs/pull/1149)]

## 2.0.3 - 2020-Feb-14

_Happy Valentine's Day ❤_

### Added

- docs: added [article](https://pnp.github.io/pnpjs/odata/debug.html) on using odata debugging extensions [[PR](https://github.com/pnp/pnpjs/pull/1037)]
- sp: added getFolderById and getFileById methods with tests and docs [[PR](https://github.com/pnp/pnpjs/pull/1042)]
- graph: added people property to user [[PR](https://github.com/pnp/pnpjs/pull/1042)]
- sp: added additional props to addValidateUpdateItemUsingPath method [[PR](https://github.com/pnp/pnpjs/pull/1042)]
- sp & graph: added automatic retry on 504 errors [@mrebuffet](https://github.com/mrebuffet) [[PR](https://github.com/pnp/pnpjs/pull/1053)]

### Changed

- docs: updated article on ie11 mode and polyfills [[PR](https://github.com/pnp/pnpjs/pull/1039)]

### Fixed

- graph: fix for missing eTag in update/delete [@JMTeamway](https://github.com/JMTeamway) [[PR](https://github.com/pnp/pnpjs/pull/1034)]
- sp: docs updates and export fixes for entity parsers [[PR](https://github.com/pnp/pnpjs/pull/1035)]
- docs: fixed transition guide link [[PR](https://github.com/pnp/pnpjs/pull/1051)]
- docs: expand article on using setBannerImage for clientside pages [[PR](https://github.com/pnp/pnpjs/pull/1051)]
- graph: fixed team displayName property [@RoelVB](https://github.com/RoelVB) [[PR](https://github.com/pnp/pnpjs/pull/1056)]
- docs: removed "src" in import path in site-users article [@ValerasNarbutas](https://github.com/ValerasNarbutas) [[PR](https://github.com/pnp/pnpjs/pull/1061)]
- odata: fixed edge case affecting batch ordering [[PR](https://github.com/pnp/pnpjs/pull/1065)]
- odata: fixed issue with core Proxy handler "has" operation [[PR](https://github.com/pnp/pnpjs/pull/1065)]
- odata: updated interface to use I prefix, code cleanup [[PR](https://github.com/pnp/pnpjs/pull/1065)]

## 2.0.2 - 2020-Jan-23

### Added

- sp: added moveByPath and copyByPath to file and folder [@joelfmrodrigues](https://github.com/joelfmrodrigues) [[PR](https://github.com/pnp/pnpjs/pull/985)]
- buildsystem: added ability to include a distint "module" build into the packages [[PR](https://github.com/pnp/pnpjs/pull/993)]

### Changed

- sp: added multiple render option capability to renderListDataAsStream [[PR](https://github.com/pnp/pnpjs/pull/980)]

### Fixed

- graph: fix for missing get method [@KEMiCZA](https://github.com/KEMiCZA) [[PR](https://github.com/pnp/pnpjs/pull/1025)]
- all: module issues importing into node and SPFx [[PR](https://github.com/pnp/pnpjs/pull/1029)]
- sp: search end point issues [@KEMiCZA](https://github.com/KEMiCZA) [[PR](https://github.com/pnp/pnpjs/pull/976)]
- sp: openWebById bug [@tavikukko](https://github.com/tavikukko) [[PR](https://github.com/pnp/pnpjs/pull/982)]
- sp: added missing properties to IListInfo interface [[PR](https://github.com/pnp/pnpjs/pull/1012)]
- polyfill: fixed issue with stack overflow and symbol [[PR](https://github.com/pnp/pnpjs/pull/1009)]
- docs: many fixes for content and typos
  - TONS of fixes [@juliemturner](https://github.com/juliemturner) [[PR](https://github.com/pnp/pnpjs/pull/1010)]
  - [@KEMiCZA](https://github.com/KEMiCZA) [[PR](https://github.com/pnp/pnpjs/pull/990)]
  - [@KEMiCZA](https://github.com/KEMiCZA) [[PR](https://github.com/pnp/pnpjs/pull/974)]
  - [@KEMiCZA](https://github.com/KEMiCZA) [[PR](https://github.com/pnp/pnpjs/pull/973)]
  - [@JakeStanger](https://github.com/JakeStanger) [[PR](https://github.com/pnp/pnpjs/pull/1007)]

## ~~2.0.1 - 2019-Jan-16~~

- Unpublished due to module issues

## 2.0.0 - 2019-12-20

### Added

- odata: added IQueryableData
- all: added tests for all methods/properties
- all: added docs entries for all methods/properties
- odata: extension methods
- sp: added ability to add/retrieve comments directly from IClientsidePage

### Changed

- odata: refactor Queryable
  - removed withPipeline
  - removed the action methods (get, post, put, delete)
  - introduced "invokable" concept
  - added additional methods to operate on Queryables
  - all inheriting methods updated with interfaces and factory functions
  - remove ODataQueryable and merged into Queryable
  - created binding functions for invokables and operations
- sp & graph: libraries can be selectively imported
- all: updated internals to use await
- all: interfaces prefixed with "I"
- odata: an empty request pipeline now throws an error
- sp & graph: updated clone to use factory methods
- sp: changed signature of createDefaultAssociatedGroups
- sp: all query string params are escaped within the library
- tooling: gulp tasks rewritten in TypeScript, updated to latest
- tooling: build system rewritten as cli
- common: extend renamed to assign
- sp: client side pages breaking changes in method signatures
- sp: breaking change to rename search classes and factories
- common: moved adalclient to @pnp/adaljsclient to reduce size of common

### Removed

- odata: removed "as" method from SharePoint & Graph Queryable
- sp: removed WebInfos class
- sp: removed InstalledLanguages class
- sp: removed Web.addClientSidePageByPath
- all: removed bundles from npm packages
- tooling: removed gulp and replaced tasks with npm scripts
- all: no longer building es5 code
- common: removed getAttrValueFromString method
