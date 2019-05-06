# @pnp/sp/utilities

Through the REST api you are able to call a subset of the SP.Utilities.Utility methods. We have explicitly defined some of these methods and provided a method to call any others in a generic manner. These methods are exposed on pnp.sp.utility and support batching and caching.

## sendEmail

This methods allows you to send an email based on the supplied arguments. The method takes a single argument, a plain object defined by the EmailProperties interface (shown below).

### EmailProperties

```TypeScript
export interface EmailProperties {

    To: string[];
    CC?: string[];
    BCC?: string[];
    Subject: string;
    Body: string;
    AdditionalHeaders?: TypedHash<string>;
    From?: string;
}
```

### Usage

You must define the To, Subject, and Body values - the remaining are optional.

```TypeScript
import { sp, EmailProperties } from "@pnp/sp";

const emailProps: EmailProperties = {
    To: ["user@site.com"],
    CC: ["user2@site.com", "user3@site.com"],
    Subject: "This email is about...",
    Body: "Here is the body. <b>It supports html</b>",
};

sp.utility.sendEmail(emailProps).then(_ => {

    console.log("Email Sent!");
});
```

## getCurrentUserEmailAddresses

This method returns the current user's email addresses known to SharePoint.

```TypeScript
import { sp } from "@pnp/sp";

sp.utility.getCurrentUserEmailAddresses().then((addressString: string) => {

    console.log(addressString);
});
```

## resolvePrincipal

Gets information about a principal that matches the specified Search criteria

```TypeScript
import { sp , PrincipalType, PrincipalSource, PrincipalInfo } from "@pnp/sp";

sp.utility.resolvePrincipal("user@site.com",
    PrincipalType.User,
    PrincipalSource.All,
    true,
    false).then((principal: PrincipalInfo) => {


        console.log(principal);
    });
```

## searchPrincipals

Gets information about the principals that match the specified Search criteria.

```TypeScript
import { sp , PrincipalType, PrincipalSource, PrincipalInfo } from "@pnp/sp";

sp.utility.searchPrincipals("john",
    PrincipalType.User,
    PrincipalSource.All,
    "",
    10).then((principals: PrincipalInfo[]) => {

        console.log(principals);
    });
```

## createEmailBodyForInvitation

Gets the external (outside the firewall) URL to a document or resource in a site.

```TypeScript
import { sp } from "@pnp/sp";

sp.utility.createEmailBodyForInvitation("https://contoso.sharepoint.com/sites/dev/SitePages/DevHome.aspx").then((r: string) => {

    console.log(r);
});
```

## expandGroupsToPrincipals

Resolves the principals contained within the supplied groups

```TypeScript
import { sp , PrincipalInfo } from "@pnp/sp";

sp.utility.expandGroupsToPrincipals(["Dev Owners", "Dev Members"]).then((principals: PrincipalInfo[]) => {

    console.log(principals);
});

// optionally supply a max results count. Default is 30.
sp.utility.expandGroupsToPrincipals(["Dev Owners", "Dev Members"], 10).then((principals: PrincipalInfo[]) => {

    console.log(principals);
});
```

## createWikiPage

```TypeScript
import { sp , CreateWikiPageResult } from "@pnp/sp";

sp.utility.createWikiPage({
    ServerRelativeUrl: "/sites/dev/SitePages/mynewpage.aspx",
    WikiHtmlContent: "This is my <b>page</b> content. It supports rich html.",
}).then((result: CreateWikiPageResult) => {

    // result contains the raw data returned by the service
    console.log(result.data);

    // result contains a File instance you can use to further update the new page
    result.file.get().then(f => {
        
        console.log(f);
    });
});
```

## containsInvalidFileFolderChars

Checks if file or folder name contains invalid characters

```TypeScript
import { sp } from "@pnp/sp";

const isInvalid = sp.utility.containsInvalidFileFolderChars("Filename?.txt");
console.log(isInvalid); // true
```

## stripInvalidFileFolderChars

Removes invalid characters from file or folder name

```TypeScript
import { sp } from "@pnp/sp";

const validName = sp.utility.stripInvalidFileFolderChars("Filename?.txt");
console.log(validName); // Filename.txt
```

## Call Other Methods

Even if a method does not have an explicit implementation on the utility api you can still call it using the UtilityMethod class. In this example we will show calling the GetLowerCaseString method, but the technique works for any of the utility methods.

```TypeScript
import { UtilityMethod } from "@pnp/sp";

// the first parameter is the web url. You can use an empty string for the current web,
// or specify it to call other web's. The second parameter is the method name.
const method = new UtilityMethod("", "GetLowerCaseString");

// you must supply the correctly formatted parameters to the execute method which
// is generic and types the result as the supplied generic type parameter.
method.excute<string>({
    sourceValue: "HeRe IS my StrINg",
    lcid: 1033,
}).then((s: string) => {

    console.log(s);
});
```
