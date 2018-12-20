# @pnp/sp/profiles

The profile services allows to to work with the SharePoint User Profile Store.

# Profiles

Profiles is accessed directly from the root sp object.
``` TypeScript
import { sp } from "@pnp/sp";
```
 
 ## GET
 
 ### getPropertiesFor(loginName: string)
 Retrieve User Profile properties for the specified user.
 ``` TypeScript
sp.profiles.getPropertiesFor(loginName).then((profile: any) => {

    console.log(profile.DisplayName);
    console.log(profile.Email);
    console.log(profile.Title);
    console.log(profile.UserProfileProperties.length);

    // Parse properties into an object called userProperties
    var properties = {};
    user.UserProfileProperties.forEach(function(prop) {
    properties[prop.Key] = prop.Value;
    });
    user.userProperties = properties;

}
```

### getUserProfilePropertyFor(loginName: string, propertyName: string)
Get a specific property for the specified user.
 ``` TypeScript
sp.profiles.getUserProfilePropertyFor(loginName, propName),then((prop: string) => {
    console.log(prop);
};
```

### getPeopleFollowedBy(loginName: string)
Returns a boolean indicating if the current user is followed by the user with loginName.
Get a specific property for the specified user.
 ``` TypeScript
sp.profiles.amIFollowedBy(loginName),then((followed: boolean) => {
    console.log(followed);
};
```