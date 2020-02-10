# @pnp/sp/site-users

The site users module provides methods to manage users for a sharepoint site.

## ISiteUsers

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 2|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br />import "@pnp/sp/site-users";|
|Selective 3|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br />import "@pnp/sp/site-users/web";|
|Preset: All|import {sp, SiteUsers } from "@pnp/sp/presets/all";|

### Get all site user

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

const users = await sp.web.siteUsers();
```

### Get Current user

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

let user = await sp.web.currentUser;
```

### Get user by id

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

const id = 6;
user = await sp.web.getUserById(id);
```

### Ensure user

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

const username = "usernames@microsoft.com";
result = await sp.web.ensureUser(username);
```

## ISiteUser

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 2|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br />import "@pnp/sp/site-users";|
|Selective 3|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br />import "@pnp/sp/site-users/web";|
|Preset: All|import {sp, SiteUsers, SiteUser } from "@pnp/sp/presets/all";|

### Get user Groups

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

let groups = await sp.web.currentUser.groups();
```

### Add user to Site collection

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

const user = await sp.web.ensureUser("userLoginname")
const users = await sp.web.siteUsers;
  
await users.add(user.data.LoginName);
```

### Get user

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

// get user object by id
const user = await sp.web.siteUsers.getById(6);

//get user object by Email
const user = await sp.web.siteUsers.getByEmail("user@mail.com");

//get user object by LoginName
const user = await sp.web.siteUsers.getByLoginName("userLoginName");
```

### Update user

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

let userProps = await sp.web.currentUser.get();
userProps.Title = "New title";
await sp.web.currentUser.update(userProps);
```

### Remove user

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

// remove user by id
await sp.web.siteUsers.removeById(6);

// remove user by LoginName
await sp.web.siteUsers.removeByLoginName(6);
```

## ISiteUserProps

User properties:

|Property Name|Type|Description|
|--|--|--|
|Email|string|Contains Site user email|
|Id|Number|Contains Site user Id|
|IsHiddenInUI|Boolean|Site user IsHiddenInUI|
|IsShareByEmailGuestUser|boolean|Site user is external user|
|IsSiteAdmin|Boolean|Describes if Site user Is Site Admin |
|LoginName|string|Site user LoginName|
|PrincipalType|number|Site user Principal type|
|Title|string|Site user Title|

```TypeScript
interface ISiteUserProps {

    /**
     * Contains Site user email
     *
     */
    Email: string;

    /**
     * Contains Site user Id
     *
     */
    Id: number;

    /**
     * Site user IsHiddenInUI
     *
     */
    IsHiddenInUI: boolean;

    /**
     * Site user IsShareByEmailGuestUser
     *
     */
    IsShareByEmailGuestUser: boolean;

    /**
     * Describes if Site user Is Site Admin
     *
     */
    IsSiteAdmin: boolean;

    /**
     * Site user LoginName
     *
     */
    LoginName: string;

    /**
     * Site user Principal type
     *
     */
    PrincipalType: number | PrincipalType;

    /**
     * Site user Title
     *
     */
    Title: string;
}
```
