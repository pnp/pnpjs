# @pnp/sp/hubsites

This module helps you with working with hubsites in your tenant.

## IHubSites

[![](https://img.shields.io/badge/Invokable-informational.svg)](../invokable.md) [![](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../selective-imports.md)

|Scenario|Import Statement|
|--|--|
|Selective|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/hubsites";|
|Preset: All|import { sp, HubSites, IHubSites } from "@pnp/sp/presets/all";|

### Get Hubsite by Id

Using the getById method on the hubsites module to get a hub site by site Id (guid).

```TypeScript
const hubsite = await sp.hubSites.getById("3504348e-b2be-49fb-a2a9-2d748db64beb")();

// log hub site title to console
console.log(hubsite.Title);
```
