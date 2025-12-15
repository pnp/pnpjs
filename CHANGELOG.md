# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 4.17.0 - 2025-Oct-20

Documentation and package updates.

-sp
  - Fixed #3309: File checkin() fails when comment has special characters in it 

## 4.16.0 - 2025-Aug-11

Documentation and package updates only.

## 4.15.0 - 2025-Jul-14

- sp
  - Small fix for addChunked for small files.

- graph
  - Fix issues with addCopyFromContentTypeHub returning queryable and header for polling api

## 4.14.0 - 2025-Jun-9

- sp
  - Update addChunked with chunkSize param

## 4.13.0 - 2025-May-12

- Documentation and package updates only

## 4.12.0 - 2025-Apr 14

- Windows 11 introduces an issue with the use of nodejs Spawn when not run through Shell. Updating Spawn Methods where needed to include shell:true.

## 4.11.0 - 2025-Mar-17

- Update of presets/all

## 4.10.0 - 2025-Feb-19

- graph
  - Implemented "Workbook" package
  - Updates batching logic for sp and graph to remove unnecessary reject carry for the send promise.

- sp
  - Adding create change token util method to sp
  - Fixed issue when moving list instead of subfolder
  - Fix content-type order type on folder
  - Adds support for sp batches to auto-split if there are too many items in the batch
  - Updates batching logic for sp and graph to remove unnecessary reject carry for the send promise.

## 4.9.0 - 2025-Jan-15

- graph
  - Added new drive endpoint to lists, which will get you drive information

## 4.8.0 - 2024-Dec-23

- graph
  - Fixed issue with resumableUpload

- nodejs
  - Removed node-fetch as minimum supported NodeJS version support native fetch.

- queryable
  - reversed removal of .clone()

## 4.7.0 - 2024-Nov-18

- sp
  - Introduces new filter lamda patterns as beta

- graph
  - Renamed OneNote Pages to OneNotePages
  - Basic Pages API support as beta
  - Site Open Extensions as beta
  - Fixed #3136 for improving paging support for query params

- queryable
  - Introduced DebugHeaders behavior

## 4.6.0 - 2024-Oct-14

- Only documentation and package updates

## 4.5.0 - 2024-Sept-16

- Only documentation and package updates

## 4.4.0 - 2024-Aug-12

- sp
  - Addresses #3091 - Update return types from Shares
  - Addresses #3104 - Replaces an in-function await to just return the promise.

- graph
  - Addresses #3083 - Adds the ability to pass in retrieveProperties to getAllChildrenAsTree. V2 and V3 had this functionality. Only supports Shared Custom Properties, not Local Custom Properties.

## 4.3.0 - 2024-July-15

- sp
  - Addresses #3082 - Improves functionality of alias parameters

- graph
  - Adds new AdvancedQuery behavior

## 4.2.0 - 2024-June-17

- Only documentation and package updates

## 4.1.1 - 2024-June-05

### Fixed

- graph
  - Fixed batching issues that fails when batched call returns 204

## 4.1.0 - 2024-May-24

### Fixed

- graph
  - Update to better handle graph default url logic

## 4.0.1 - 2024-Apr-23

### Fixed

- graph
  - Fixed issue with SPFx behavior null check #3012

## 4.0.0 - 2024-Apr-22
## 5.0.0 - 2025?

### Added

- graph
  - Missing group management endpoints
  
### Removed

### Changed

- graph
  - GroupType enum in Groups changed Office365 to Microsoft365
