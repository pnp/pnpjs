# @pnp/sp/profiles

The profile services allows to to work with the SharePoint User Profile Store.

# Profiles

Profiles is accessed directly from the root sp object.
``` TypeScript
import { sp } from "@pnp/sp";
```
 
## GET
 
### Get profile properties for a specific user
``` getPropertiesFor(loginName: string): Promise<any>; ```

``` TypeScript
sp
  .profiles
  .getPropertiesFor(loginName).then((profile: any) => {

    console.log(profile.DisplayName);
    console.log(profile.Email);
    console.log(profile.Title);
    console.log(profile.UserProfileProperties.length);

    // Properties are stored in inconvenient Key/Value pairs,
    // so parse into an object called userProperties
    var properties = {};
    profile.UserProfileProperties.forEach(function(prop) {
    properties[prop.Key] = prop.Value;
    });
    profile.userProperties = properties;

}
```

### Get a specific property for a specific user
``` getUserProfilePropertyFor(loginName: string, propertyName: string): Promise<string>; ```

``` TypeScript
sp
  .profiles
  .getUserProfilePropertyFor(loginName, propName).then((prop: string) => {
    console.log(prop);
};
```


### Find whether a user is following another user
``` isFollowing(follower: string, followee: string): Promise<boolean>; ```

``` TypeScript
sp
  .profiles
  .isFollowing(follower, followee).then((followed: boolean) => {
    console.log(followed);
};
```


### Find out who a user is following
``` getPeopleFollowedBy(loginName: string): Promise<any[]>; ```

``` TypeScript
sp
  .profiles
  .getPeopleFollowedBy(loginName).then((followed: any[]) => {
    console.log(followed.length);
};
```

### Find out if the current user is followed by another user
``` amIFollowedBy(loginName: string): Promise<boolean>; ```

Returns a boolean indicating if the current user is followed by the user with loginName.
Get a specific property for the specified user.

``` TypeScript
sp
  .profiles
  .amIFollowedBy(loginName).then((followed: boolean) => {
    console.log(followed);
};
```

### Get the people who are following the specified user
``` getFollowersFor(loginName: string): Promise<any[]>; ```

``` TypeScript
sp
  .profiles
  .getFollowersFor(loginName).then((followed: any) => {
    console.log(followed.length);
};
```


## SET

### Set a single value property value
``` setSingleValueProfileProperty(accountName: string, propertyName: string, propertyValue: string) ```

Set a user's user profile property.

``` TypeScript
sp
  .profiles
  .setSingleValueProfileProperty(accountName, propertyName, propertyValue);
```

### Set multi valued User Profile property
``` setMultiValuedProfileProperty(accountName: string, propertyName: string, propertyValues: string[]): Promise<void>; ```

``` TypeScript
sp
  .profiles
  .setSingleValueProfileProperty(accountName, propertyName, propertyValues);
```

### Upload and set the user profile picture
Users can upload a picture to their own profile only). Not supported for batching.
Blob data representing the user's picture in BMP, JPEG, or PNG format of up to 4.76MB

``` setMyProfilePic(profilePicSource: Blob): Promise<void>; ```