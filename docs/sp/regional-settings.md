# @pnp/sp/regional-settings

The regional settings module helps with managing dates and times across various timezones.

## IRegionalSettings

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/regional-settings/web";

const sp = spfi(...);

// get all the web's regional settings
const s = await sp.web.regionalSettings();

// select only some settings to return
const s2 = await sp.web.regionalSettings.select("DecimalSeparator", "ListSeparator", "IsUIRightToLeft")();
```

### Installed Languages

You can get a list of the installed languages in the web.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/regional-settings/web";

const sp = spfi(...);

const s = await sp.web.regionalSettings.getInstalledLanguages();
```

> The installedLanguages property accessor is deprecated after 2.0.4 in favor of getInstalledLanguages and will be removed in future versions.

### TimeZones

You can also get information about the selected timezone in the web and all of the defined timezones.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/regional-settings/web";

const sp = spfi(...);

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

### Title and Description Resources

Some objects allow you to read language specific title information as shown in the following sample. This applies to Web, List, Field, Content Type, and User Custom Actions.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/regional-settings";

const sp = spfi(...);

//
// The below methods appears on
// - Web
// - List
// - Field
// - ContentType
// - User Custom Action
//
// after you import @pnp/sp/regional-settings
//
// you can also import just parts of the regional settings:
// import "@pnp/sp/regional-settings/web";
// import "@pnp/sp/regional-settings/list";
// import "@pnp/sp/regional-settings/content-type";
// import "@pnp/sp/regional-settings/field";
// import "@pnp/sp/regional-settings/user-custom-actions";


const title = await sp.web.titleResource("en-us");
const title2 = await sp.web.titleResource("de-de");

const description = await sp.web.descriptionResource("en-us");
const description2 = await sp.web.descriptionResource("de-de");
```

> You can only read the values through the REST API, not set the value.
