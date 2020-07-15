# @pnp/sp/profiles

The profile services allows you to work with the SharePoint User Profile Store.

## Profiles

Profiles is accessed directly from the root sp object.

```typescript
import { sp } from "@pnp/sp";
import "@pnp/sp/profiles";
```

## Get edit profile link for the current user

```typescript
editProfileLink(): Promise<string>
```

```typescript
const editProfileLink = await sp.profiles.editProfileLink();
console.log("My edit profile link =" + editProfileLink);
```

## Is My People List Public

Provides a boolean that indicates if the current users "People I'm Following" list is public or not

```typescript
isMyPeopleListPublic(): Promise<boolean>
```

```typescript
const isPublic = await sp.profiles.isMyPeopleListPublic();
console.log("Is my Following list Public =" + isPubic);
```

## Find out if the current user is followed by another user

Provides a boolean that indicates if the current users is followed by a specific user.

```typescript
amIFollowedBy(loginName: string): Promise<boolean>
```

```typescript
const loginName = "i:0#.f|membership|testuser@mytenant.onmicrosoft.com";
const isFollowedBy = await sp.profiles.amIFollowedBy(loginName);
console.log("Is " + loginName + " following me? " + isFollowedBy);
```

## Find out if I am following a specific user

Provides a boolean that indicates if the current users is followed by a specific user.

```typescript
amIFollowing(loginName: string): Promise<boolean>
```

```typescript
const loginName = "i:0#.f|membership|testuser@mytenant.onmicrosoft.com";
const following = await sp.profiles.amIFollowing(loginName);
console.log("Am I following " + loginName + "? " + following);
```

## Get the tags I follow

Gets the tags the current user is following. Accepts max count, default is 20.

```typescript
getFollowedTags(maxCount = 20): Promise<string[]>
```

```typescript
const tags = await sp.profiles.getFollowedTags();
console.log(tags);
```

## Get followers for a specific user

Gets the people who are following the specified user.

```typescript
getFollowersFor(loginName: string): Promise<any[]>
```

```typescript
const loginName = "i:0#.f|membership|testuser@mytenant.onmicrosoft.com";
const followers = await sp.profiles.getFollowersFor(loginName);
followers.forEach((value) => {
  console.log(value);
});
```

## Get followers for the current

Gets the people who are following the current user.

```typescript
myFollowers(): ISharePointQueryableCollection
```

```typescript
const folowers = await sp.profiles.myFollowers();
console.log(folowers);
```

## Get the properties for the current user

Gets user properties for the current user.

```typescript
myProperties(): _SharePointQueryableInstance
```

```typescript
const profile = await sp.profiles.myProperties.get();
console.log(profile.DisplayName);
console.log(profile.Email);
console.log(profile.Title);
console.log(profile.UserProfileProperties.length);

// Properties are stored in Key/Value pairs,
// so parse into an object called userProperties
var props = {};
profile.UserProfileProperties.forEach((prop) => {
  props[prop.Key] = prop.Value;
});
profile.userProperties = props;
console.log("Account Name: " + profile.userProperties.AccountName);
```

## Gets people specified user is following

```typescript
getPeopleFollowedBy(loginName: string): Promise<any[]>
```

```typescript
const loginName = "i:0#.f|membership|testuser@mytenant.onmicrosoft.com";
const folowers = await sp.profiles.getFollowersFor(loginName);
followers.forEach((value) => {
  console.log(value);
});
```

## Gets properties for a specified user

```typescript
getPropertiesFor(loginName: string): Promise<any>
```

```typescript
const loginName = "i:0#.f|membership|testuser@mytenant.onmicrosoft.com";
const profile = await sp.profiles.getPropertiesFor(loginName);
console.log(profile.DisplayName);
console.log(profile.Email);
console.log(profile.Title);
console.log(profile.UserProfileProperties.length);

// Properties are stored in inconvenient Key/Value pairs,
// so parse into an object called userProperties
var props = {};
profile.UserProfileProperties.forEach((prop) => {
  props[prop.Key] = prop.Value;
});

profile.userProperties = props;
console.log("Account Name: " + profile.userProperties.AccountName);
```

## Gets most popular tags

Gets the 20 most popular hash tags over the past week, sorted so that the most popular tag appears first

```typescript
trendingTags(): Promise<IHashTagCollection>
```

```typescript
const tags = await sp.profiles.trendingTags();
tags.Items.forEach((tag) => {
  console.log(tag);
});
```

## Gets specified user profile property for the specified user

```typescript
getUserProfilePropertyFor(loginName: string, propertyName: string): Promise<string>
```

```typescript
const loginName = "i:0#.f|membership|testuser@mytenant.onmicrosoft.com";
const propertyName = "AccountName";
const property = await sp.profiles.getUserProfilePropertyFor(loginName, propertyName);
console.log(property);
```

## Hide specific user from list of suggested people

Removes the specified user from the user's list of suggested people to follow.

```typescript
hideSuggestion(loginName: string): Promise<void>
```

```typescript
const loginName = "i:0#.f|membership|testuser@mytenant.onmicrosoft.com";
await sp.profiles.hideSuggestion(loginName);
```

## Is one user following another

Indicates whether the first user is following the second user.
First parameter is the account name of the user who might be following the followee.
Second parameter is the account name of the user who might be followed by the follower.

```typescript
isFollowing(follower: string, followee: string): Promise<boolean>
```

```typescript
const follower = "i:0#.f|membership|testuser@mytenant.onmicrosoft.com";
const followee = "i:0#.f|membership|testuser2@mytenant.onmicrosoft.com";
const isFollowing = await sp.profiles.isFollowing(follower, followee);
console.log(isFollowing);
```

## Set User Profile Picture

Uploads and sets the user profile picture (Users can upload a picture to their own profile only). Not supported for batching.
Accepts the profilePicSource Blob data representing the user's picture in BMP, JPEG, or PNG format of up to 4.76MB.

```typescript
setMyProfilePic(profilePicSource: Blob): Promise<void>
```

```typescript
import { sp } from "@pnp/sp";
import "@pnp/sp/web";
import "@pnp/sp/lists/web";
import "@pnp/sp/profiles";
import "@pnp/sp/folders";
import "@pnp/sp/files";

// get the blob object through a request or from a file input
const blob = await sp.web.lists.getByTitle("Documents").rootFolder.files.getByName("profile.jpg").getBlob();

await sp.profiles.setMyProfilePic(blob);
```

## Sets single value User Profile property

accountName The account name of the user
propertyName Property name
propertyValue Property value

```typescript
setSingleValueProfileProperty(accountName: string, propertyName: string, propertyValue: string): Promise<void>
```

```typescript
const loginName = "i:0#.f|membership|testuser@mytenant.onmicrosoft.com";
await sp.profiles.setSingleValueProfileProperty(loginName, "CellPhone", "(123) 555-1212");
```

## Sets a mult-value User Profile property

accountName The account name of the user
propertyName Property name
propertyValues Property values

```typescript
setMultiValuedProfileProperty(accountName: string, propertyName: string, propertyValues: string[]): Promise<void>
```

```typescript
const loginName = "i:0#.f|membership|testuser@mytenant.onmicrosoft.com";
const propertyName = "SPS-Skills";
const propertyValues = ["SharePoint", "Office 365", "Architecture", "Azure"];
await sp.profiles.setMultiValuedProfileProperty(loginName, propertyName, propertyValues);
const profile = await sp.profiles.getPropertiesFor(loginName);
var props = {};
profile.UserProfileProperties.forEach((prop) => {
  props[prop.Key] = prop.Value;
});
profile.userProperties = props;
console.log(profile.userProperties[propertyName]);
```

## Create Personal Site for specified users

Provisions one or more users' personal sites. (My Site administrator on SharePoint Online only)
Emails The email addresses of the users to provision sites for

```typescript
createPersonalSiteEnqueueBulk(...emails: string[]): Promise<void>
```

```typescript
let userEmails: string[] = ["testuser1@mytenant.onmicrosoft.com", "testuser2@mytenant.onmicrosoft.com"];
await sp.profiles.createPersonalSiteEnqueueBulk(userEmails);
```

## Get the user profile of the owner for the current site

```typescript
ownerUserProfile(): Promise<IUserProfile>
```

```typescript
const profile = await sp.profiles.ownerUserProfile();
console.log(profile);
```

## Get the user profile of the current user

```typescript
userProfile(): Promise<any>
```

```typescript
const profile = await sp.profiles.userProfile();
console.log(profile);
```

## Create personal site for current user

```typescript
createPersonalSite(interactiveRequest = false): Promise<void>
```

```typescript
await sp.profiles.createPersonalSite();
```

## Make all profile data public or private

Set the privacy settings for all social data.

```typescript
shareAllSocialData(share: boolean): Promise<void>
```

```typescript
await sp.profiles.shareAllSocialData(true);
```

## Resolve a user or group

Resolves user or group using specified query parameters

```typescript
clientPeoplePickerResolveUser(queryParams: IClientPeoplePickerQueryParameters): Promise<IPeoplePickerEntity>
```

```typescript
const result = await sp.profiles.clientPeoplePickerSearchUser({
  AllowEmailAddresses: true,
  AllowMultipleEntities: false,
  MaximumEntitySuggestions: 25,
  QueryString: 'John'
});
console.log(result);
```

## Search a user or group

Searches for users or groups using specified query parameters

```typescript
clientPeoplePickerSearchUser(queryParams: IClientPeoplePickerQueryParameters): Promise<IPeoplePickerEntity[]>
```

```typescript
const result = await sp.profiles.clientPeoplePickerSearchUser({
  AllowEmailAddresses: true,
  AllowMultipleEntities: false,
  MaximumEntitySuggestions: 25,
  QueryString: 'John'
});
console.log(result);
```
