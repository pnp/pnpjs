# @pnp/sp/column-defaults

The column defaults sub-module allows you to manage the default column values on a library or library folder.

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

## Get Folder Defaults

You can get the default values for a specific folder as shown below:

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";
import "@pnp/sp/column-defaults";

const sp = spfi(...);

const defaults = await sp.web.getFolderByServerRelativePath("/sites/dev/DefaultColumnValues/fld_GHk5").getDefaultColumnValues();

/*
The resulting structure will have the form:

[
  {
    "name": "{field internal name}",
    "path": "/sites/dev/DefaultColumnValues/fld_GHk5",
    "value": "{the default value}"
  },
  {
    "name": "{field internal name}",
    "path": "/sites/dev/DefaultColumnValues/fld_GHk5",
    "value": "{the default value}"
  }
]
*/
```

## Set Folder Defaults

When setting the defaults for a folder you need to include the field's internal name and the value.

>For more examples of other field types see the section [Pattern for setting defaults on various column types](#Pattern-for-setting-defaults-on-various-column-types)

>_Note: Be very careful when setting the path as the site collection url is case sensitive_

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";
import "@pnp/sp/column-defaults";

const sp = spfi(...);

await sp.web.getFolderByServerRelativePath("/sites/dev/DefaultColumnValues/fld_GHk5").setDefaultColumnValues([{
  name: "TextField",
  value: "Something",
},
{
  name: "NumberField",
  value: 14,
}]);
```

## Get Library Defaults

You can also get all of the defaults for the entire library.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/column-defaults";

const sp = spfi(...);

const defaults = await sp.web.lists.getByTitle("DefaultColumnValues").getDefaultColumnValues();

/*
The resulting structure will have the form:

[
  {
    "name": "{field internal name}",
    "path": "/sites/dev/DefaultColumnValues",
    "value": "{the default value}"
  },
  {
    "name": "{field internal name}",
    "path": "/sites/dev/DefaultColumnValues/fld_GHk5",
    "value": "{a different default value}"
  }
]
*/
```

## Set Library Defaults

You can also set the defaults for an entire library at once (root and all sub-folders). This may be helpful in provisioning a library or other scenarios. When setting the defaults for the entire library you must also include the path value with is the server relative path to the folder. When setting the defaults for a folder you need to include the field's internal name and the value.

>For more examples of other field types see the section [Pattern for setting defaults on various column types](#Pattern-for-setting-defaults-on-various-column-types)

>_Note: Be very careful when setting the path as the site collection url is case sensitive_

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/column-defaults";

const sp = spfi(...);

await sp.web.lists.getByTitle("DefaultColumnValues").setDefaultColumnValues([{
  name: "TextField",
  path: "/sites/dev/DefaultColumnValues",
  value: "#PnPjs Rocks!",
}]);
```

## Clear Folder Defaults

If you want to clear all of the folder defaults you can use the clear method:

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";
import "@pnp/sp/column-defaults";

const sp = spfi(...);

await sp.web.getFolderByServerRelativePath("/sites/dev/DefaultColumnValues/fld_GHk5").clearDefaultColumnValues();
```

## Clear Library Defaults

If you need to clear all of the default column values in a library you can pass an empty array to the list's setDefaultColumnValues method.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/column-defaults";

const sp = spfi(...);

await sp.web.lists.getByTitle("DefaultColumnValues").setDefaultColumnValues([]);
```

## Pattern for setting defaults on various column types

The following is an example of the structure for setting the default column value when using the setDefaultColumnValues that covers the various field types.

```TypeScript
[{
    // Text/Boolean/CurrencyDateTime/Choice/User
    name: "TextField":
    path: "/sites/dev/DefaultColumnValues",
    value: "#PnPjs Rocks!",
}, {
    //Number
    name: "NumberField",
    path: "/sites/dev/DefaultColumnValues",
    value: 42,
}, {
    //Date
    name: "NumberField",
    path: "/sites/dev/DefaultColumnValues",
    value: "1900-01-01T00:00:00Z",
}, {
    //Date - Today
    name: "NumberField",
    path: "/sites/dev/DefaultColumnValues",
    value: "[today]",
}, {
    //MultiChoice
    name: "MultiChoiceField",
    path: "/sites/dev/DefaultColumnValues",
    value: ["Item 1", "Item 2"],
}, {
    //MultiChoice - single value
    name: "MultiChoiceField",
    path: "/sites/dev/DefaultColumnValues/folder2",
    value: ["Item 1"],
}, {
    //Taxonomy - single value
    name: "TaxonomyField",
    path: "/sites/dev/DefaultColumnValues",
    value: {
        wssId:"-1",
        termName: "TaxValueName",
        termId: "924d2077-d5e3-4507-9f36-4a3655e74274"
        }
}, {
    //Taxonomy - multiple value
    name: "TaxonomyMultiField",
    path: "/sites/dev/DefaultColumnValues",
    value: [{
        wssId:"-1",
        termName: "TaxValueName",
        termId: "924d2077-d5e3-4507-9f36-4a3655e74274"
        },{
        wssId:"-1",
        termName: "TaxValueName2",
        termId: "95d4c307-dde5-49d8-b861-392e145d94d3"
        },]
}]);
```

## Taxonomy Full Example

This example shows fully how to get the taxonomy values and set them as a default column value using PnPjs.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/column-defaults";
import "@pnp/sp/taxonomy";

const sp = spfi(...);

// get the term's info we want to use as the default
const term = await sp.termStore.sets.getById("ea6fc521-d293-4f3d-9e84-f3a5bc0936ce").getTermById("775c9cf6-c3cd-4db9-8cfa-fc0aeefad93a")();

// get the default term label
const defLabel = term.labels.find(v => v.isDefault);

// set the default value using -1, the term id, and the term's default label name
await sp.web.lists.getByTitle("MetaDataDocLib").rootFolder.setDefaultColumnValues([{
  name: "MetaDataColumnInternalName",
  value: {
      wssId: "-1",
      termId: term.id,
      termName: defLabel.name,
  }
}])

// check that the defaults have updated
const newDefaults = await sp.web.lists.getByTitle("MetaDataDocLib").getDefaultColumnValues();
```
