# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- @pnp/sp: Support for backwards navigation in item paging skip method [[PR](https://github.com/pnp/pnp/pull/16)]
- @pnp/sp: Added support for % and # character in files and folders with the ResourcePath API [[PR](https://github.com/pnp/pnp/pull/16)]
- @pnp/sp: Added support for social follow API (_api/social.following) [[PR](https://github.com/pnp/pnp/pull/16)] [[Docs](./packages/sp/docs/social.md)]
- @pnp/sp: Added commentsDisabled property to ClientSidePage class [[PR](https://github.com/pnp/pnp/pull/18)] [[Docs](./packages/sp/docs/client-side-pages.md#control-comments)]

### Fixed
- @pnp/sp: Fixed issue with File.setContentChunked and Files.addChunked in odata=verbose mode [[PR](https://github.com/pnp/pnp/pull/16)]
- @pnp/sp: Fixed issue clone and configure [[PR](https://github.com/pnp/pnp/pull/16)]
- @pnp/graph: Fixed issue clone and configure [[PR](https://github.com/pnp/pnp/pull/16)]
- @pnp/sp: Fixed issue with adding client-side webparts with ids with {} chars [[PR](https://github.com/pnp/pnp/pull/16)]
- @pnp/sp: Fixed issue with adding client-side webparts and setting order values [[PR](https://github.com/pnp/pnp/pull/17)]


## 1.0.2 - 2018-02-15

### Added
- @pnp/sp: Support for managing client-side pages [[PR](https://github.com/pnp/pnp/pull/7)]
- @pnp/sp: getAll method on Items collection [[PR](https://github.com/pnp/pnp/pull/4)]
- @pnp/sp: addUser, addLookup, addChoice, addMultiChoice, and addBoolean on Fields collection [[PR](https://github.com/pnp/pnp/pull/4)]
- @pnp/sp: getClientSideWebParts method on Web [[PR](https://github.com/pnp/pnp/pull/7)]
- tooling: updates to test gulp task to support --s and --site parameters [[PR](https://github.com/pnp/pnp/pull/7)]

### Changed
- Removed gulp-util in favor of individual libraries per guidance [[PR](https://github.com/pnp/pnp/pull/7)]

## 1.0.1 - 2018-01-22

### Added
- Everything