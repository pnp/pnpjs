# @pnp/sp/user-custom-actions

Represents a custom action associated with a SharePoint list, web or site collection.

## IUserCustomActions

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import { IUserCustomActions, IUserCustomAction } from "@pnp/sp/user-custom-actions";|
|Selective 2|import { sp } from "@pnp/sp";<br />import "@pnp/sp/user-custom-actions";|
|Preset: All|import { sp, IUserCustomActions, IUserCustomAction } from "@pnp/sp/presents/all";|

### Get a collection of User Custom Actions from a web

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/user-custom-actions";

const userCustomActions = sp.web.userCustomActions();
```

### Add a new User Custom Action

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/user-custom-actions";
import { IUserCustomActionAddResult } from '@pnp/sp/user-custom-actions';

const newValues: TypedHash<string> = {
    "Title": "New Title",
    "Description": "New Description",
    "Location": "ScriptLink",
    "ScriptSrc": "https://..."
};

const response : IUserCustomActionAddResult = await sp.web.userCustomActions.add(newValues);
```

### Get a User Custom Action by ID

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/user-custom-actions";

const uca: IUserCustomAction = sp.web.userCustomActions.getById("00000000-0000-0000-0000-000000000000");

const ucaData = await uca();
```

### Clear the User Custom Action collection

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/user-custom-actions";

// Site collection level
await sp.site.userCustomActions.clear();

// Site (web) level
await sp.web.userCustomActions.clear();

// List level
await sp.web.lists.getByTitle("Documents").userCustomActions.clear();
```

## IUserCustomAction

### Update an existing User Custom Action

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/user-custom-actions";
import { IUserCustomActionUpdateResult } from '@pnp/sp/user-custom-actions';

const uca = sp.web.userCustomActions.getById("00000000-0000-0000-0000-000000000000");

const newValues: TypedHash<string> = {
    "Title": "New Title",
    "Description": "New Description",
    "ScriptSrc": "https://..."
};

const response: IUserCustomActionUpdateResult = uca.update(newValues);
```
