# @pnp/sp/regional-settings

The regional settings module helps with managing dates and times across various timezones.

## IRegionalSettings

[![](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br />import { IRegionalSettings, ITimeZone, ITimeZones, RegionalSettings, TimeZone, TimeZones, } from "@pnp/sp/src/regional-settings";|
|Selective 2|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br />import "@pnp/sp/src/regional-settings";|
|Selective 3|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br />import "@pnp/sp/src/regional-settings/web";|
|Preset: All|import { sp, Webs, IWebs } from "@pnp/sp/presets/all";|

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/regional-settings/web";

// get all the web's regional settings
const s = await sp.web.regionalSettings();

// select only some settings to return
const s2 = await sp.web.regionalSettings.select("DecimalSeparator", "ListSeparator", "IsUIRightToLeft")();
```

### Installed Languages

You can get a list of the installed languages in the web.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/regional-settings/web";

const s = await sp.web.regionalSettings.installedLanguages();

// you can select which fields to return as well
const s = await sp.web.regionalSettings.installedLanguages.select("DisplayName")();
```

### TimeZones

You can also get information about the selected timezone in the web and all of the defined timezones.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/regional-settings/web";

// get the web's configured timezone
const s = await sp.web.regionalSettings.timeZone();

// select just the Description and Id
const s2 = await sp.web.regionalSettings.timeZone.select("Description", "Id")();

// get all the timezones
const s3 = await sp.web.regionalSettings.timeZones();

// get a specific timezone by id
// list of ids: https://msdn.microsoft.com/en-us/library/office/jj247008.aspx
const s4 = await sp.web.regionalSettings.timeZones.getById(23);
const s5 = await s.localTimeToUTC(new Date());

// convert a given date from web's local time to UTC time
const s6 = await sp.web.regionalSettings.timeZone.localTimeToUTC(new Date());

// convert a given date from UTC time to web's local time
const s6 = await sp.web.regionalSettings.timeZone.utcToLocalTime(new Date())
const s7 = await sp.web.regionalSettings.timeZone.utcToLocalTime(new Date(2019, 6, 10, 10, 0, 0, 0))
```
