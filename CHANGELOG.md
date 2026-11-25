# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 5.0.0 - 2025?

### Added

- graph
  - Missing group management endpoints
  - `chats` module: `graph.chats` and a user's `chats`, including create, update, delete, `removeAllAccessForUser` and the chat for a user's installed app
  - `messages` module: chat and channel messages (`TeamsChatMessage`, `TeamsChatMessages`), message `replies`, and `getAllMessages` and `getAllRetainedMessages` for a user's chats and a team's channels
  - Chat members in the `members` module: list, get, add and remove
  - `presets/all` includes the `chats` and `messages` modules and exports `open-extensions`
- sp-admin
  - `admin.siteRenameJobs`: change a site's address with `add`, including the `SiteRenameOptions` and `SiteRenameSkipGestures` settings, and read its rename jobs with `getJobsBySiteUrl`
  
### Removed

### Changed

- graph
  - GroupType enum in Groups changed Office365 to Microsoft365
  - Channel messages moved from the `teams` module to the `messages` module, so `channel.messages` now needs `import "@pnp/graph/messages"`
  - `channel.messages.add` returns the new `ChatMessage` instead of `{ data, message }`
