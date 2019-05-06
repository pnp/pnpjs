# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 2.0.0 - 2019-XX-XX

_These changes are from the move from 1.X.X libraries to 2.0.0 and represent the beginning of a new changelog for the 2.X.X family_

### Added

- odata: added IQueryableData

### Changed

- odata: refactor Queryable
  - remove withPipeline (becomes a function argument bind and )
  - removed the action methods (get, post, put, delete)
  - introduced "invokables"
  - added methods to operate on Queryables
  - all inheriting methods updated with interfaces and factory functions
  - remove ODataQueryable and merged into Queryable
- sp & graph: libraries can be selectively imported
- all: updated internals to use await
- all: interfaces prefixed with "I"
- odata: empty request pipeline will throw an error
- sp & graph: updated clone to use factory
- sp: changed signature of createDefaultAssociatedGroups
- sp: all query string params are escaped now within the library

### Fixed


### Removed

- removed "as" method from SharePoint & Graph Queryable
- removed WebInfos class
- removed InstalledLanguages class
- removed Web.addClientSidePageByPath

