# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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

