# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- @pnp/sp: Support for backwards navigation in item paging skip method
- @pnp/sp: Added support for % and # character in files and folders with the ResourcePath API
- @pnp/sp: Added support for social follow API (_api/social.following)

### Fixed
- @pnp/sp: Fixed issue with File.setContentChunked and Files.addChunked in odata=verbose mode
- @pnp/sp: Fixed issue clone and configure
- @pnp/graph: Fixed issue clone and configure
- @pnp/sp: Fixed issue with adding client-side webparts with ids with {} chars [PR](#1)


## 1.0.2 - 2018-02-15

### Added
- @pnp/sp: Support for managing client-side pages
- @pnp/sp: getAll method on Items collection
- @pnp/sp: addUser, addLookup, addChoice, addMultiChoice, and addBoolean on Fields collection
- @pnp/sp: getClientSideWebParts method on Web
- tooling: updates to test gulp task to support --s and --site parameters

### Changed
- Removed gulp-util in favor of individual libraries per guidance

## 1.0.1 - 2018-01-22

### Added
- Everything