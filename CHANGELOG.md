# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 1.3.7 - 2019-11-08

### Added

- @pnp/graph: Added functionality to set mailnickname for new teams ([@frnk01](https://github.com/frnk01)) [[PR](https://github.com/pnp/pnpjs/pull/913)]
- @pnp/sp: Adds support for including query params with renderListDataAsStream [[PR](https://github.com/pnp/pnpjs/pull/916)]

### Fixed

- docs: Fixed broken sp getItem code sample ([@garrytrinder](https://github.com/garrytrinder)) [[PR](https://github.com/pnp/pnpjs/pull/875)]
- @pnp/sp: Fixed code comment for addClientSitePage method ([@olemp](https://github.com/olemp)) [[PR](https://github.com/pnp/pnpjs/pull/879)]
- docs: Fixed typo in docs ([@Noradrex](https://github.com/Noradrex)) [[PR](https://github.com/pnp/pnpjs/pull/885)]
- @pnp/sp: Fixes an issue with promoting pages before they are published [[PR](https://github.com/pnp/pnpjs/pull/916)]

## 1.3.6 - 2019-10-11

### Added

- @pnp/sp: Added addUsingPath method to Folders [[PR](https://github.com/pnp/pnpjs/pull/870)]
- @pnp/graph: Added manager property to user [[PR](https://github.com/pnp/pnpjs/pull/870)]
- @pnp/sp-taxonomy: Added delete method to term [[PR](https://github.com/pnp/pnpjs/pull/870)]

### Fixed

- @pnp/sp: Fixed Folder.moveTo url bug ([@nsoeth](https://github.com/nsoeth)) [[PR](https://github.com/pnp/pnpjs/pull/833)]
- @pnp/sp: Fixed for getCurrentUserEffectivePermissions and low permission users ([@koltyakov](https://github.com/koltyakov)) [[PR](https://github.com/pnp/pnpjs/pull/846)]
- docs: Added missing hubSiteId method parameter to docs [[PR](https://github.com/pnp/pnpjs/pull/870)]
- @pnp/sp: Fixed bug with createCommunicationSite method parsing response [[PR](https://github.com/pnp/pnpjs/pull/870)]

## 1.3.5 - 2019-08-16

### Added

- @pnp/graph: Added user calendar endpoint ([@JakeStanger](https://github.com/JakeStanger)) [[PR](https://github.com/pnp/pnpjs/pull/789)]
- @pnp/graph: Added telemetry tracking header [[PR](https://github.com/pnp/pnpjs/pull/794)]
- @pnp/sp-clientsvc: Added escaping for XML chars in request bodies [[PR](https://github.com/pnp/pnpjs/pull/820)]

### Fixed

- @pnp/sp: Fixed typing issue with SecondaryQueryResults [[PR](https://github.com/pnp/pnpjs/pull/819)]

## 1.3.4 - 2019-07-12

### Added

- @pnp/graph: setEndpoint method of GraphQueryable now public [[PR](https://github.com/pnp/pnpjs/pull/779)]
- @pnp/graph: added photo to User ([@JakeStanger](https://github.com/JakeStanger)) [[PR](https://github.com/pnp/pnpjs/pull/776)]
- @pnp/sp: Added entity merging and docs for Items getPaged method [[PR](https://github.com/pnp/pnpjs/pull/771)]
- @pnp/sp: Added site design parameter to createModernTeamSite method [[PR](https://github.com/pnp/pnpjs/pull/769)]
- @pnp/sp: Added Item recycle method ([@gitbrent](https://github.com/gitbrent)) [[PR](https://github.com/pnp/pnpjs/pull/752)]
- @pnp/sp: Added site delete and communication site creation ([@KEMiCZA](https://github.com/KEMiCZA)) [[PR](https://github.com/pnp/pnpjs/pull/738)]
- @pnp/sp: Added many site designs methods ([@KEMiCZA](https://github.com/KEMiCZA)) [[PR](https://github.com/pnp/pnpjs/pull/733)]

### Fixed

- @pnp/nodejs: Fixed SPTokenUtils to use shared fetch method [[PR](https://github.com/pnp/pnpjs/pull/770)]
- @pnp/sp: Fixed issue with BasePermissions parsing [[PR](https://github.com/pnp/pnpjs/pull/768)]
- @pnp/sp: Fixed issues with loading single page app client side pages [[PR](https://github.com/pnp/pnpjs/pull/735)]
- @pnp/graph: Fixed item create parameters typings bug [[PR](https://github.com/pnp/pnpjs/pull/764)]
- documentation: Fixed broken nav links [[PR](https://github.com/pnp/pnpjs/pull/763)]
- @pnp/nodejs: Fixed import issue with AdalCertificateFetchClient ([@cebud](https://github.com/cebud)) [[PR](https://github.com/pnp/pnpjs/pull/729)]

## 1.3.3 - 2019-06-03

### Added

- @pnp/sp: Added promoteToNews method to clientsidepage [[PR](https://github.com/pnp/pnpjs/pull/597)]
- @pnp/graph: Added directReports method to user ([@olemp](https://github.com/olemp)) [[PR](https://github.com/pnp/pnpjs/pull/612)]
- @pnp/nodejs: Added support for client certificate auth ([@kcasamento](https://github.com/kcasamento)) [[PR](https://github.com/pnp/pnpjs/pull/700)]

### Fixed

- @pnp/polyfill-ie11: Fixed missing Object.assign polyfill ([@koltyakov](https://github.com/koltyakov)) [[PR](https://github.com/pnp/pnpjs/pull/718)]

## 1.3.2 - 2019-05-04

### Added

- @pnp/graph: Added support for people queries ([@simonagren](https://github.com/simonagren)) [[PR](https://github.com/pnp/pnpjs/pull/572)]
- @pnp/graph: Added support for security APIs & related docs ([@simonagren](https://github.com/simonagren)) [[PR](https://github.com/pnp/pnpjs/pull/573)]
- @pnp/sp: Expose ability to get tenant app catalog web [[PR](https://github.com/pnp/pnpjs/pull/581)]
- @pnp/nodejs: Added ability to use proxy with nodejs [[PR](https://github.com/pnp/pnpjs/pull/581)]

### Fixed

- @pnp/sp: Fixed issue with batches with internal requests [[PR](https://github.com/pnp/pnpjs/pull/581)]
- @pnp/sp: Fixed return data parsing for HubSiteData method [[PR](https://github.com/pnp/pnpjs/pull/581)]
- @pnp/sp: Fixed issue with setting banner image on client side pages [[PR](https://github.com/pnp/pnpjs/pull/581)]
- @pnp/graph: Fixes docs related to Teams ([@taylanken](https://github.com/taylanken)) [[PR](https://github.com/pnp/pnpjs/pull/588)]

## 1.3.1 - 2019-21-03

### Added

- @pnp/sp: Added ability to set section emphasis for modern pages [[PR](https://github.com/pnp/pnpjs/pull/561)]
- @pnp/sp: Added setBannerImage method to ClientSidePage [[PR](https://github.com/pnp/pnpjs/pull/561)] 
- @pnp/sp: Added support for HubSiteId while creating modern sites ([@gautamdsheth](https://github.com/gautamdsheth)) [[PR](https://github.com/pnp/pnpjs/pull/553)]
- @pnp/sp: Added support for "SingleWebPartAppPage" & "RepostPage" modern page types ([@gautamdsheth](https://github.com/gautamdsheth)) [[PR](https://github.com/pnp/pnpjs/pull/554)]
- @pnp/sp: Added getFileById and getFolderById methods to Web ([@tavikukko](https://github.com/tavikukko)) [[PR](https://github.com/pnp/pnpjs/pull/562)]

### Fixed

- @pnp/sp: Fixed code to set id and anchorComponentId for new text webparts [[PR](https://github.com/pnp/pnpjs/pull/561)]
- @pnp/sp: Fixed ClientSidePage to respect configureFrom settings [[PR](https://github.com/pnp/pnpjs/pull/561)]
- @pnp/common: updated storage to not hang if getter throws an exception ([@cslecours](https://github.com/cslecours)) [[PR](https://github.com/pnp/pnpjs/pull/546)]

## 1.3.0 - 2019-08-03

### Added

- @pnp/graph: Added support for SharePoint sites, lists, columns, items and more endpoints ([@simonagren](https://github.com/simonagren)) [[PR](https://github.com/pnp/pnpjs/pull/503)]
- @pnp/graph: Added support for insights ([@simonagren](https://github.com/simonagren)) [[PR](https://github.com/pnp/pnpjs/pull/511)]
- @pnp/sp: Added copyPage method to ClientSidePage [[PR](https://github.com/pnp/pnpjs/pull/533)]
- @pnp/sp: Added getSiteCollectionAppCatalog to Web [[PR](https://github.com/pnp/pnpjs/pull/533)]

### Changed

- @pnp/sp: Changed NavigationService contructor to allow specifying site [[PR](https://github.com/pnp/pnpjs/pull/533)]

### Fixed

- documentation: Fixed spelling errors in docs ([@michaelmaillot](https://github.com/michaelmaillot)) [[PR](https://github.com/pnp/pnpjs/pull/516)]
- documentation: Fixed spelling errors docs ([@0xflotus](https://github.com/michaelmaillot)) [[PR](https://github.com/pnp/pnpjs/pull/543)]
- @pnp/sp: Fixed client side page management [[PR](https://github.com/pnp/pnpjs/pull/533)]
- @pnp/sp: Fixed return types for verbose json in utility methods [[PR](https://github.com/pnp/pnpjs/pull/533)]


## 1.2.9 - 2019-08-02

### Added

- @pnp/graph: Added subscriptions + documentation ([@simonagren](https://github.com/simonagren)) [[PR](https://github.com/pnp/pnpjs/pull/465)]
- @pnp/graph: Added remove to members and owners ([@simonagren](https://github.com/simonagren)) [[PR](https://github.com/pnp/pnpjs/pull/488)]
- @pnp/sp: Added HubSite functionality and Types ([@simonagren](https://github.com/simonagren)) [[PR](https://github.com/pnp/pnpjs/pull/490)]
- @pnp/sp: Added DateTimeFieldFriendlyFormatType enum ([@tsekityam](https://github.com/tsekityam)) [[PR](https://github.com/pnp/pnpjs/pull/462)]

### Changed

- @pnp/sp: web.allproperties now returns SharePointQueryableInstance [[PR](https://github.com/pnp/pnpjs/pull/484)]

### Fixed

- @pnp/sp: Fixed batching issue when using items.add [[PR](https://github.com/pnp/pnpjs/pull/474)]

## 1.2.8 - 2019-11-01

### Added

- @pnp/sp-taxonomy: Add support for add new term from term ([@siata13](https://github.com/siata13)) [[PR](https://github.com/pnp/pnpjs/pull/411)]
- @pnp/sp: Added support for new location column creation ([@gautamdsheth](https://github.com/gautamdsheth)) [[PR](https://github.com/pnp/pnpjs/pull/413)]
- @pnp/sp-taxonomy: Adds groups property to TermStore object in sp-taxonomy ([@AJIXuMuK](https://github.com/AJIXuMuK)) [[PR](https://github.com/pnp/pnpjs/pull/421)]
- documentation: @pnp/sp profiles packages functions docs ([@sympmarc](https://github.com/sympmarc)) [[PR](https://github.com/pnp/pnpjs/pull/438)]
- @pnp/graph: Added invitations create method ([@simonagren](https://github.com/simonagren)) [[PR](https://github.com/pnp/pnpjs/pull/443)]

### Changed

- @pnp/sp: Changes clientstate to be optional when creating subscriptions ([@tavikukko](https://github.com/tavikukko)) [[PR](https://github.com/pnp/pnpjs/pull/431)]
- @pnp/sp: Updates parameters when updating a subscription ([@tavikukko](https://github.com/tavikukko)) [[PR](https://github.com/pnp/pnpjs/pull/434)]

### Fixed

- @pnp/sp: Fix for parsing html for ClientSidePages [[PR](https://github.com/pnp/pnpjs/pull/412)]
- @pnp/logging: Fix to ensure logging never throws an exception [[PR](https://github.com/pnp/pnpjs/pull/416)]
- @pnp/odata: Fix for how batches are prepared to remove timing errors [[PR](https://github.com/pnp/pnpjs/pull/432)]
- @pnp/sp: Fix for ClientSidePages encoding of * and $ chars [[PR](https://github.com/pnp/pnpjs/pull/436)]
- @pnp/sp: Fix getParentWeb method ([@tavikukko](https://github.com/tavikukko)) [[PR](https://github.com/pnp/pnpjs/pull/442)]
- documentation: Fix polyfill docs bug ([@laskewitz](https://github.com/Laskewitz)) [[PR](https://github.com/pnp/pnpjs/pull/444)]
- @pnp/sp-taxonomy: Fix for batching when reusing object instances [[PR](https://github.com/pnp/pnpjs/pull/446)]

## 1.2.7 - 2018-12-10

### Added

- @pnp/graph: Added support for messages, mailFolders, and mailboxSettings on user [[PR](https://github.com/pnp/pnpjs/pull/379)]
- @pnp/graph: Added support for directory objects and new methods in groups and docs updates ([@simonagren](https://github.com/simonagren)) [[PR](https://github.com/pnp/pnpjs/pull/378)]
- @pnp/nodejs: Added support for enhanced usage in provider hosted applications ([@pedro-pedrosa](https://github.com/pedro-pedrosa)) [[PR](https://github.com/pnp/pnpjs/pull/339)] [[docs](https://github.com/pnp/pnpjs/blob/dev/packages/nodejs/docs/provider-hosted-app.md)]
- @pnp/graph: Added support for Teams methods now in GA ([@simonagren](https://github.com/simonagren)) [[PR](https://github.com/pnp/pnpjs/pull/373)]

### Changed

- @pnp/common: Update in getGuid to prevent collisions ([@AustinBreslinDev](https://github.com/AustinBreslinDev)) [[PR](https://github.com/pnp/pnpjs/pull/399)]

### Fixed

- @pnp/sp: Expanded typings for userCustomActions.add [[PR](https://github.com/pnp/pnpjs/pull/377)]
- @pnp/sp: Fixed comm site creation issue ([@gautamdsheth](https://github.com/gautamdsheth)) [[PR](https://github.com/pnp/pnpjs/pull/380)]
- @pnp/sp: Fixed IRefiner.Entries as array ([@cslecours](https://github.com/cslecours)) [[PR](https://github.com/pnp/pnpjs/pull/386)]
- @pnp/sp: Expanded folder.update allowed types [[PR](https://github.com/pnp/pnpjs/pull/393)]

## 1.2.6 - 2018-11-16

### Added

- @pnp/sp-taxonomy: Adds support for the getTermsById to TermStore [[PR](https://github.com/pnp/pnpjs/pull/370)]
- @pnp/sp: Added list property to item which is the parent list [[PR](https://github.com/pnp/pnpjs/pull/368)]
- @pnp/sp-taxonomy: Adds setItemMetaDataField and setItemMetaDataMultiField utility methods [[PR](https://github.com/pnp/pnpjs/pull/368)] [[docs](https://github.com/pnp/pnpjs/blob/dev/packages/sp-taxonomy/docs/utilities.md)]
- @pnp/sp: Adds support for the setViewXml method to the View object [[PR](https://github.com/pnp/pnpjs/pull/367)]
- @pnp/sp: Added IRefiner interface over ResultTable.Refiners ([@pljfdi](https://github.com/pljfdi)) [[PR](https://github.com/pnp/pnpjs/pull/352)]
- @pnp/sp: Added support to create Modern communication and team(O365 backed) sites ([@gautamdsheth](https://github.com/gautamdsheth)) [[PR](https://github.com/pnp/pnpjs/pull/351)]
- @pnp/graph: Added update and delete methods to user
- documentation: Added article on [merging entities](https://pnp.github.io/pnpjs/sp/docs/entity-merging/) in sp library

### Changed

- @pnp/odata: Enhanced error message for pipeline http errors

## 1.2.5 - 2018-11-09

### Fixed

- @pnp/sp: Fixed regression in search ([@gautamdsheth](https://github.com/gautamdsheth)) [[PR](https://github.com/pnp/pnpjs/pull/353)]

## 1.2.4 - 2018-11-02

### Added

- @pnp/polyfill-ie11: New package to contain the required polyfills for IE11 [[PR](https://github.com/pnp/pnpjs/pull/283)] [[docs](https://pnp.github.io/pnpjs/documentation/polyfill/)]
- @pnp/sp: Added 'groups' endpoint to 'currentUser' ([@pedro-pedrosa](https://github.com/pedro-pedrosa)) [[PR](https://github.com/pnp/pnpjs/pull/274)]
- @pnp/sp: Added Fields addDependentLookupField ([@seanmarthur](https://github.com/seanmarthur)) [[PR](https://github.com/pnp/pnpjs/pull/282)]
- @pnp/sp: Added 'createDefaultAssociatedGroups' to Web class ([@pedro-pedrosa](https://github.com/pedro-pedrosa)) [[PR](https://github.com/pnp/pnpjs/pull/291)]
- @pnp/sp: Added utility methods to check and strip invalid characters in file/folder url ([@phawrylak](https://github.com/phawrylak)) [[PR](https://github.com/pnp/pnpjs/pull/276)] [[docs](https://github.com/pnp/pnpjs/blob/dev/packages/sp/docs/sp-utilities-utility.md#containsinvalidfilefolderchars)]
- @pnp/graph: Added expanded support for OneDrive and associated operations ([@simonagren](https://github.com/simonagren)) [[PR](https://github.com/pnp/pnpjs/pull/284)]
- @pnp/sp: Added skipFeatureDeployment option to app deploy ([@pedro-pedrosa](https://github.com/pedro-pedrosa)) [[PR](https://github.com/pnp/pnpjs/pull/303)]
- @pnp/sp-taxonomy: Added getDescription method to Term [[PR](https://github.com/pnp/pnpjs/pull/301)]
- @pnp/sp: Added like/unlike support and likedByInformation for modern pages ([@gautamdsheth](https://github.com/gautamdsheth)) [[PR](https://github.com/pnp/pnpjs/pull/305)]
- @pnp/sp: Added support to send list item attachments to recycle bin (soft delete) ([@gautamdsheth](https://github.com/gautamdsheth)) [[PR](https://github.com/pnp/pnpjs/pull/306)]
- @pnp/sp: Added support for site designs and site scripts ([@KEMiCZA](https://github.com/KEMiCZA)) [[PR](https://github.com/pnp/pnpjs/pull/312)]
- documentation: Added article on [how to build the docs locally](https://github.com/pnp/pnpjs/blob/dev/packages/documentation/documentation.md). ([@KEMiCZA](https://github.com/KEMiCZA)) [[PR](https://github.com/pnp/pnpjs/pull/315)]
- @pnp/sp: Added support for Hub site APIs ([@gautamdsheth](https://github.com/gautamdsheth)) [[PR](https://github.com/pnp/pnpjs/pull/329)]
- @pnp/graph: Added support to automatically handle the requests/batch limit [[PR](https://github.com/pnp/pnpjs/pull/333)]


### Changed

- @pnp/nodejs: NodeFetchClient updated to handle transient errors ([@kcasamento](https://github.com/kcasamento)) [[PR](https://github.com/pnp/pnpjs/pull/289)]
- documentation: Update issue AppPermissionRequest XML debugging.md ([@KEMiCZA](https://github.com/KEMiCZA)) [[PR](https://github.com/pnp/pnpjs/pull/311)]
- @pnp/common: Updated ADALClient to make use of SPFx 1.6 AADTokenProvider [[PR](https://github.com/pnp/pnpjs/pull/316)]

### Fixed

- @pnp/sp: Fixed search query tag issue ([@gautamdsheth](https://github.com/gautamdsheth)) [[PR](https://github.com/pnp/pnpjs/pull/326)]
- @pnp/sp: Fixed typo in SearchPropertyValue interface (Intval -> IntVal) ([@luismanez](https://github.com/luismanez)) [[PR](https://github.com/pnp/pnpjs/pull/328)]
- @pnp/odata: Fixed caching settings loss during clone  [[PR](https://github.com/pnp/pnpjs/pull/330)]
- @pnp/graph: Fixed batching which should now work with GA [[PR](https://github.com/pnp/pnpjs/pull/323)]
- @pnp/graph: Fixed issue with using skip operator in collections [[PR](https://github.com/pnp/pnpjs/pull/333)]

## 1.2.3 - 2018-10-10

### Fixed

- all: Fix for es6 code in es5 bundles [[PR](https://github.com/pnp/pnpjs/pull/271)]

## 1.2.2 - 2018-10-05

### Fixed

- @pnp/sp: Fix issue with adding a lookup field ([@gautamdsheth](https://github.com/gautamdsheth)) [[PR](https://github.com/pnp/pnpjs/pull/239)]
- @pnp/sp: Fix for missing dataVersion in client webpart import ([@simonagren](https://github.com/simonagren)) [[PR](https://github.com/pnp/pnpjs/pull/242)]
- @pnp/sp: Fixed for renderListData, renderListFormData methods result parsing in verbose OData mode [[PR](https://github.com/pnp/pnpjs/pull/243)]
- @pnp/sp: Fixed issue with SearchQueryBuilder collection properties [[PR](https://github.com/pnp/pnpjs/pull/246)]
- @pnp/sp: Fixed issue chaining off getByLoginName [[PR](https://github.com/pnp/pnpjs/pull/246)]
- @pnp/graph: Fixed documentation issue ([@s-KaiNet](https://github.com/s-KaiNet)) [[PR](https://github.com/pnp/pnpjs/pull/252)]

### Changed

- documentation: Updated article on polyfills [[PR](https://github.com/pnp/pnpjs/pull/246)]
- @pnp/odata: Updated docs on parsers [[PR](https://github.com/pnp/pnpjs/pull/246)]
- tooling: Updated project to use new TypeScript project references [[PR](https://github.com/pnp/pnpjs/pull/262)]
- tooling: Updated build process to improve performance, update to use webpack 4 [[PR](https://github.com/pnp/pnpjs/pull/266)]

### Added

- @pnp/odata: Added HttpRequestError class [[PR](https://github.com/pnp/pnpjs/pull/246)] [[docs](https://github.com/pnp/pnpjs/blob/dev/packages/odata/docs/parsers.md#odatadefaultparser)]
- @pnp/sp: Added support for /web/DefaultDocumentLibrary ([@phawrylak](https://github.com/phawrylak)) [[PR](https://github.com/pnp/pnpjs/pull/257)]
- @pnp/graph: Expanded support for contacts and folders ([@simonagren](https://github.com/simonagren)) [[PR](https://github.com/pnp/pnpjs/pull/264)]

## 1.2.1 - 2018-09-05

### Fixed

- @pnp/sp: Fix issue with getting site user by id [[PR](https://github.com/pnp/pnpjs/pull/224)]

### Added

- @pnp/sp: Use the Retry-After header if available for throttled requests [[PR](https://github.com/pnp/pnpjs/pull/224)]
- tooling: Added --skip-web flag for gulp test command [[PR](https://github.com/pnp/pnpjs/pull/224)]

## 1.2.0 - 2018-09-04

### Added

- @pnp/sp: ability to specify generic type with Items getPaged method [[PR](https://github.com/pnp/pnpjs/pull/207)]
- documentation: added section for paging to List Items page [[PR](https://github.com/pnp/pnpjs/pull/207)]
- @pnp/common: added alias functions for jsS and hOP [[PR](https://github.com/pnp/pnpjs/pull/207)]
- @pnp/sp: Items.getAll now takes optional second argument for accept header [[PR](https://github.com/pnp/pnpjs/pull/207)]
- @pnp/sp: Added defaultPath class decorator [[PR](https://github.com/pnp/pnpjs/pull/207)]
- @pnp/common: Added getHashCode to exports [[PR](https://github.com/pnp/pnpjs/pull/207)]
- @pnp/sp: Added searchWithCaching to root sp object [[PR](https://github.com/pnp/pnpjs/pull/207)]
- @pnp/sp: Search instances now support usingCaching [[PR](https://github.com/pnp/pnpjs/pull/207)]
- @pnp/sp: Export SPBatch class from library [[PR](https://github.com/pnp/pnpjs/pull/221)]

### Changed

- testing: Updated tests for common [[PR](https://github.com/pnp/pnpjs/pull/207)]
- all: Replaced all uses of Dictionary with Map [[PR](https://github.com/pnp/pnpjs/pull/207)]
- @pnp/sp: spExtractODataId renamed to odataUrlFrom [[PR](https://github.com/pnp/pnpjs/pull/207)]
- @pnp/common: combinePaths renamed to combine [[PR](https://github.com/pnp/pnpjs/pull/207)]
- @pnp/sp: spExtractODataId renamed to odataUrlFrom [[PR](https://github.com/pnp/pnpjs/pull/207)]
- @pnp/sp: SearchQueryBuilder create function removed [[PR](https://github.com/pnp/pnpjs/pull/207)]
- documentation: Updated deployment article [[PR](https://github.com/pnp/pnpjs/pull/207)]
- tooling: Added plugin to rollup config for node globals [[PR](https://github.com/pnp/pnpjs/pull/207)]

### Fixed

- @pnp/sp: Fixed issue parsing odata metadata due to service change [[PR](https://github.com/pnp/pnpjs/pull/204)]
- documentation: Fixed typo [[PR](https://github.com/pnp/pnpjs/pull/205)]

### Removed

- @pnp/common: Removed Util static class in favor of function exports [[PR](https://github.com/pnp/pnpjs/pull/207)]
- @pnp/common: Removed readBlobAsText and readBlobAsArrayBuffer functions [[PR](https://github.com/pnp/pnpjs/pull/207)]
- @pnp/common: Removed Dictionary class in favor of Map [[PR](https://github.com/pnp/pnpjs/pull/207)]
- all: Removed custom exceptions in favor of Error [[PR](https://github.com/pnp/pnpjs/pull/207)]
- @pnp/common: Removed decorators for beta & deprecated [[PR](https://github.com/pnp/pnpjs/pull/207)]
- @pnp/common: Removed dependency on @pnp/logging [[PR](https://github.com/pnp/pnpjs/pull/207)]


## 1.1.4 - 2018-08-06

### Added

- documentation: Added search box, updated UML diagram display [[PR](https://github.com/pnp/pnpjs/pull/194)]

### Fixed

- @pnp/sp: Fixed SearchResult interface's ViewsLifetime property casing [[PR](https://github.com/pnp/pnpjs/pull/192)]
- @pnp/sp: Fixed spExtractODataId to correctly parse entity urls [[PR](https://github.com/pnp/pnpjs/pull/193)]

## 1.1.3 - 2018-08-03

### Added

- documentation: UML class diagrams in documentation ([@fthorild](https://github.com/fthorild)) [[PR](https://github.com/pnp/pnpjs/pull/183)]

### Changed

- @pnp/sp: Updated MySocialQueryMethods followed method to return SocialActor[] instead of any[] [[PR](https://github.com/pnp/pnpjs/pull/176)]

### Fixed

- @pnp/sp-taxonomy: Fixed bug with getting collections and chaining from objects within array [[PR](https://github.com/pnp/pnpjs/pull/182)]
- @pnp/sp: Fixed issue with chaining on file object returned from addChunked [[PR](https://github.com/pnp/pnpjs/pull/161)]

### Removed

- @pnp/sp: Removed internal method spGetEntityUrl [[PR](https://github.com/pnp/pnpjs/pull/161)]

## 1.1.2 - 2018-07-06

### Added

- tooling: Setup Travis CI to process PRs and merges [[PR](https://github.com/pnp/pnpjs/pull/131)]
- tooling: Added support for --verbose flag when using gulp test
- documentation: Added article on deployment listing cdnjs urls [[PR](https://github.com/pnp/pnpjs/pull/145)]
- @pnp/nodejs: Support for local cloud authentication (China, Germany, US Gov) [[PR](https://github.com/pnp/pnpjs/pull/154)]

### Changed

- tooling: Updated travis test to use a custom mocha impl allowing for ignore timeouts [[PR](https://github.com/pnp/pnpjs/pull/136)]
- @pnp/pnpjs: Updated global variable name from $pnp -> pnp, docs updated to reflect change [[PR](https://github.com/pnp/pnpjs/pull/143)]
- @pnp/common: dateAdd timespan parameter now bound to custom string enumeration type
- documentation: Styling changes [[PR](https://github.com/pnp/pnpjs/pull/151)]
- @pnp/nodejs: SPFetchClient contructor realm parameter is now fifth [[PR](https://github.com/pnp/pnpjs/pull/154)]
- @pnp/sp: Added View, Views, and ViewFields to the exports [[PR](https://github.com/pnp/pnpjs/pull/155)]

### Fixed

- @pnp/sp: Fixed bug where parsing ClientSideText webpart from existing page included extra "</div>" [[PR](https://github.com/pnp/pnpjs/pull/129)]
- @pnp/sp: Changed return type of getPropertiesFor to be any instead of any[] [[PR](https://github.com/pnp/pnpjs/pull/130)]
- @pnp/sp: Fixed issue with decoding escaped json in ClientSidePage [[PR](https://github.com/pnp/pnpjs/pull/133)] [[PR](https://github.com/pnp/pnpjs/pull/150)]


## 1.1.1 - 2018-06-11

### Added

- @pnp/sp: Export UserProfileQuery from userprofiles ([@allanhvam](https://github.com/allanhvam)) [[PR](https://github.com/pnp/pnpjs/pull/123)]

### Fixed

- @pnp/nodejs: Fixed typo reported in #117 [[PR](https://github.com/pnp/pnpjs/pull/121)]
- tooling: Fixed path errors when building on non-Windows OS [[PR](https://github.com/pnp/pnpjs/pull/122)]

### Changed

- @pnp/sp-taxonomy: Updated default value for isAvailableForTagging when creating a team to true [[PR](https://github.com/pnp/pnpjs/pull/116)]

## 1.1.0 - 2018-05-29

### Added

- @pnp/sp-taxonomy: Added new library to support fluent queries against SharePoint Taxonomy data
- @pnp/sp-clientsvc: Added new library with fluent API base classes for client.svc based requests
- @pnp/common: Added utility method sanitizeGuid and getAttrValueFromString
- @pnp/odata: Added LambdaParser that takes any function to handle parsing Response
- tooling: Added --stats flag to gulp package to output webpack stats during bundle

### Fixed

- @pnp/odata: Fixed bug in BufferParser
- tooling: Fixed bug in serving individual packages using --p
- @pnp/sp: fixed issue in generated js files where $$VERSION$$ placeholder was not replaced correctly
- @pnp/graph: Disallowed caching of non-GET requests
- tooling: Fixed docs-clean ordering issue so everything is clean before other tasks run

### Changed

- @pnp/nodejs: Updated how global shims are set for Request types (Headers, Response, Request)
- @pnp/odata: Changes to request pipeline to support sp-clientsvc (non-breaking)
- @pnp/odata: Remove public get from abstract class Queryable (non-breaking)
- @pnp/sp: Added exports for toAbsoluteUrl and extractWebUrl utility methods
- @pnp/logging: Changed default LogLevel to Info for write and writeJSON
- build: Added preserveConstEnums flag to tsconfig.json
- docs: Small formatting changes, added anchors to headings in html to ease linking
- all: Updated package.json dependencies in root and individual packages
- docs: Updates to docs, added section on sp-taxonomy and sp-clientsvc libraries

### Removed

- @pnp/sp: Removed unused APIUrlException class
- @pnp/nodejs: Removed packaging step to webpack bundle, no need for node and reduces package size

### Deprecated

- @pnp/common: Deprecated exported static Util class. Migrate to using the individually exported methods

## 1.0.5 - 2018-05-11

### Added

- @pnp/sp: Added web's getParentWeb helper method [[PR](https://github.com/pnp/pnpjs/pull/74)]
- @pnp/sp: Added moveTo helper method for folder object [[PR](https://github.com/pnp/pnpjs/pull/75)]
- @pnp/sp: Added support for likes and comments on list items and modern pages [[PR](https://github.com/pnp/pnpjs/pull/85)]
- @pnp/sp: Added addClientSidePageByPath method to Web [[PR](https://github.com/pnp/pnpjs/pull/101)]
- @pnp/sp: Added getRootWeb method to Site [[PR](https://github.com/pnp/pnpjs/pull/102)]

### Fixed

- @pnp/nodejs: Fixed incorrect import for Request shims due to version change [[PR](https://github.com/pnp/pnpjs/pull/67)]
- @pnp/sp: Fixed docs for web example code [[PR](https://github.com/pnp/pnpjs/pull/72)]
- @pnp/config-store: Fixed docs and a bug in loading configuration [[PR](https://github.com/pnp/pnpjs/pull/73)]
- @pnp/sp: Fixed clientPeoplePickerSearchUser and clientPeoplePickerResolveUser methods running error with verbose OData mode [[PR](https://github.com/pnp/pnpjs/pull/79)]
- tooling: Fixed bug in gulp task test when using the --p flag .inactive.js test files were run [[PR](https://github.com/pnp/pnpjs/pull/85)]
- docs: Fixed import references ([@tarjeieo](https://github.com/tarjeieo)) [[PR](https://github.com/pnp/pnpjs/pull/87)]
- @pnp/odata: Updated all parsers to use same error handling code path [[PR](https://github.com/pnp/pnpjs/pull/90)]
- @pnp/sp: AddValidateUpdateItemUsingPath method [[PR](https://github.com/pnp/pnpjs/pull/89)]
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
