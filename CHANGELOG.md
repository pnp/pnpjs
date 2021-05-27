# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 3.0.0 - 20XX-XXXX-XX

### Fixed


### Added

- Introduced "Timeline" concept and supporting code with moments

- common:
  - delay utility function

### Changed

- Renamed package "odata" -> "queryable"

### Removed

- queryable:
  - LambdaParser -> just write a handler
  - TextParser, BlobParser, JSONParser, BufferParser -> TextParse, BlobParse, JSONParse, BufferParse behaviors

- nodejs: 
  - AdalCertificateFetchClient, AdalFetchClient, MsalFetchClient, SPFetchClient -> use MSAL behavior
  - BearerTokenFetchClient -> use @pnp/Queryable BearerToken behavior
  - SPFetchClient -> Use SPNodeFetch which includes SP retry logic
