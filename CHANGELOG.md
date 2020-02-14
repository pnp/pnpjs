# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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

