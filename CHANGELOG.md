# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 2.0.5 - 2020-05-08

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

## 2.0.4 - 2020-04-10

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

## 2.0.3 - 2020-02-14

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


## 2.0.2 - 2020-01-23

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

## ~~2.0.1 - 2019-01-16~~

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

