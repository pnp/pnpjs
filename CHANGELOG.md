# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 2.0.0 - 2019-XX-XX

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
- sp: libraries can be selectively imported
- all: updated internals to use await
- all: interfaces prefixed with "I"
- odata: an empty request pipeline now throws an error
- sp: updated clone to use factory methods
- sp: changed signature of createDefaultAssociatedGroups
- sp: all query string params are escaped within the library
- tooling: gulp tasks rewritten in TypeScript, updated to latest
- tooling: build system rewritten as cli
- common: extend renamed to assign
- sp: client side pages breaking changes in method signatures
- sp: breaking change to rename search classes and factories
- common: moved adalclient to @pnp/adaljsclient to reduce size of common

### Fixed

### Removed

- graph: removed all support for calling the graph API as required by the MS Graph Product Group
- odata: removed "as" method from SharePoint & Graph Queryable
- sp: removed WebInfos class
- sp: removed InstalledLanguages class
- sp: removed Web.addClientSidePageByPath
- all: removed bundles from npm packages
- tooling: removed gulp and replaced tasks with npm scripts
- all: no longer building es5 code
- common: removed getAttrValueFromString method

