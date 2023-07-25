# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 4.0.0 - 2023-Nov-11

### Fixed

### Added

- graph
  - explict error thrown if SPFx context is null or undefined when needed

- sp
  - explict error thrown if SPFx context is null or undefined when needed

### Removed

- graph
  - paged method removed from IGraphQueryableCollection

- sp
  - getPaged method removed from _Items/IItems
  - PagedItemCollection removed from library
  - removed /items/get-all import, unneeded, use async iterator patterns

### Changed

- graph
  - IGraphQueryableCollection now supports async iterator pattern
  - IGraphQueryableCollection count method now returns -1 if the collection does not support counting
  - All GraphQueryable*, _GraphQueryable*, and IGraphQueryable* have been renamed to remove "Queryable" (ex: GraphQueryableCollection is now GraphCollection)

- sp
  - _Items and IItems now supports async iterator pattern


