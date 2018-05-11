# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- @pnp/sp: Added web's getParentWeb helper method [[PR](https://github.com/pnp/pnpjs/pull/74)]
- @pnp/sp: Added support for likes and comments on list items and modern pages [[PR](https://github.com/pnp/pnpjs/pull/85)]

### Fixed

- @pnp/nodejs: Fixed incorrect import for Request shims due to version change [[PR](https://github.com/pnp/pnpjs/pull/67)]
- @pnp/sp: Fixed docs for web example code [[PR](https://github.com/pnp/pnpjs/pull/72)]
- @pnp/config-store: Fixed docs and a bug in loading configuration [[PR](https://github.com/pnp/pnpjs/pull/73)]
- @pnp/sp: Fixed clientPeoplePickerSearchUser and clientPeoplePickerResolveUser methods running error with verbose OData mode [[PR](https://github.com/pnp/pnpjs/pull/79)]
- tooling: Fixed bug in gulp task test when using the --p flag .inactive.js test files were run [[PR](https://github.com/pnp/pnpjs/pull/85)]
- docs: Fixed import references ([@tarjeieo](https://github.com/tarjeieo)) [[PR](https://github.com/pnp/pnpjs/pull/87)]
- @pnp/odata: Updated all parsers to use same error handling code path [[PR](https://github.com/pnp/pnpjs/pull/90)]
- @pnp/sp: listItemAllFields object type fix [[PR](https://github.com/pnp/pnpjs/pull/98)]

### Changed

- @pnp/odata: Removed core.ts and moved code into parsers.ts to simplify [[PR](https://github.com/pnp/pnpjs/pull/90)]

## 1.0.4 - 2018-04-06

### Added

- @pnp/common: AdalClient for in-browser adal auth support. [[PR](https://github.com/pnp/pnpjs/pull/32)]
- @pnp/sp: Support for $expand in items.getAll ([@eirikb](https://github.com/eirikb)) [[PR](https://github.com/pnp/pnpjs/pull/33)]
- @pnp/odata: configureFrom method to queryable [[PR](https://github.com/pnp/pnpjs/pull/42)]
- @pnp/graph: Added basic support for onenote notebooks ([@olemp](https://github.com/olemp)) [[PR](https://github.com/pnp/pnpjs/pull/37)]
- @pnp/graph: Added basic support for users ([@olemp](https://github.com/olemp)) [[PR](https://github.com/pnp/pnpjs/pull/38)]
- @pnp/sp: Added support for ClientPeoplePickerWebServiceInterface ([@phawrylak](https://github.com/phawrylak)) [[PR](https://github.com/pnp/pnpjs/pull/43)]
- @pnp/sp: Added remove method to client side section, column, and part [[PR](https://github.com/pnp/pnpjs/pull/60)]
- @pnp/sp: Added setStorageEntity and removeStorageEntity & docs page [[PR](https://github.com/pnp/pnpjs/pull/64)]

### Changed

- @pnp/sp: Change search result properties to be enumerable [[PR](https://github.com/pnp/pnpjs/pull/41)]
- @pnp/nodejs: Updated docs for SPFetchClient
- @pnp/odata: Created a Queryable base class to serve as a generic base to ODataQueryable [[PR](https://github.com/pnp/pnpjs/pull/53)]
- all: Internally replaced import of Util with import of individual methods [[PR](https://github.com/pnp/pnpjs/pull/60)]
- all: Documentation updates
- @pnp/sp: Changed getStorageEntity return type to correct interface from string [[PR](https://github.com/pnp/pnpjs/pull/64)]
- all: update package.json dependencies


### Fixed

- all: Documentation fixes for typos [[PR](https://github.com/pnp/pnpjs/pull/26)]
- @pnp/graph: Typo in groups.calendar property name ([@olemp](https://github.com/olemp)) [[PR](https://github.com/pnp/pnpjs/pull/36)]
- @pnp/graph: Issue with graph.setup and fetchClientFactory [[PR](https://github.com/pnp/pnpjs/pull/32)]
- @pnp/sp: Issue where configuration options not passed to child calls in getPaged and getAll [[PR](https://github.com/pnp/pnpjs/pull/42)]
- @pnp/sp: Issue with matching last closing div when loading ClientText part ([@estruyf](https://github.com/estruyf)) [[PR](https://github.com/pnp/pnpjs/pull/47)]
- @pnp/nodejs: Issue with types.d.ts local dep [[PR](https://github.com/pnp/pnpjs/pull/50)]
- buildsystem: Issue where the $$Version$$ placeholder was not being replaced on build [[PR](https://github.com/pnp/pnpjs/pull/61)]

## 1.0.3 - 2018-03-05

### Added
- @pnp/sp: Support for backwards navigation in item paging skip method [[PR](https://github.com/pnp/pnpjs/pull/16)]
- @pnp/sp: Support for % and # character in files and folders with the ResourcePath API [[PR](https://github.com/pnp/pnpjs/pull/16)]
- @pnp/sp: Support for social follow API (_api/social.following) [[PR](https://github.com/pnp/pnpjs/pull/16)] [[Docs](./packages/sp/docs/social.md)]
- @pnp/sp: commentsDisabled property to ClientSidePage class [[PR](https://github.com/pnp/pnpjs/pull/18)] [[Docs](./packages/sp/docs/client-side-pages.md#control-comments)]
- @pnp/sp: Support for finding controls to ClientSidePage class [[PR](https://github.com/pnp/pnpjs/pull/19)] [[Docs](./packages/sp/docs/client-side-pages.md#find-controls)]
- @pnp/sp: Export ContentTypes and RegionalSettings related classes ([@allanhvam](https://github.com/allanhvam)) [[PR](https://github.com/pnp/pnpjs/pull/24)]


### Fixed
- @pnp/sp: Issue with File.setContentChunked and Files.addChunked in odata=verbose mode [[PR](https://github.com/pnp/pnpjs/pull/16)]
- @pnp/sp: Issue with clone and configure [[PR](https://github.com/pnp/pnpjs/pull/16)]
- @pnp/graph: Issue clone and configure [[PR](https://github.com/pnp/pnpjs/pull/16)]
- @pnp/sp: Issue with adding client-side webparts with ids with {} chars [[PR](https://github.com/pnp/pnpjs/pull/16)]
- @pnp/sp: Issue with adding client-side webparts and setting order values [[PR](https://github.com/pnp/pnpjs/pull/17)]


## 1.0.2 : 2018-02-15

### Added
- @pnp/sp: Support for managing client-side pages [[PR](https://github.com/pnp/pnpjs/pull/7)]
- @pnp/sp: getAll method on Items collection [[PR](https://github.com/pnp/pnpjs/pull/4)]
- @pnp/sp: addUser, addLookup, addChoice, addMultiChoice, and addBoolean on Fields collection [[PR](https://github.com/pnp/pnpjs/pull/4)]
- @pnp/sp: getClientSideWebParts method on Web [[PR](https://github.com/pnp/pnpjs/pull/7)]
- tooling: updates to test gulp task to support --s and --site parameters [[PR](https://github.com/pnp/pnpjs/pull/7)]


### Changed
- Removed gulp-util in favor of individual libraries per guidance [[PR](https://github.com/pnp/pnpjs/pull/7)]

## 1.0.1 - 2018-01-22

### Added
- Everything
