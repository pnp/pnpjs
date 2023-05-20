# @pnp/sp/utilities

Through the REST api you are able to call a subset of the SP.Utilities.Utility methods. We have explicitly defined some of these methods and provided a method to call any others in a generic manner. These methods are exposed on pnp.sp.utility and support batching and caching.

## sendEmail

This methods allows you to send an email based on the supplied arguments. The method takes a single argument, a plain object defined by the EmailProperties interface (shown below).

### EmailProperties

```TypeScript
export interface TypedHash<T> {
    [key: string]: T;
}

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
import { spfi } from "@pnp/sp";
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";

const sp = spfi(...);

const emailProps: IEmailProperties = {
    To: ["user@site.com"],
    CC: ["user2@site.com", "user3@site.com"],
    BCC: ["user4@site.com", "user5@site.com"],
    Subject: "This email is about...",
    Body: "Here is the body. <b>It supports html</b>",
    AdditionalHeaders: {
        "content-type": "text/html"
    }
};

await sp.utility.sendEmail(emailProps);
console.log("Email Sent!");
```

## getCurrentUserEmailAddresses

This method returns the current user's email addresses known to SharePoint.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sputilities";

const sp = spfi(...);

let addressString: string = await sp.utility.getCurrentUserEmailAddresses();

// and use it with sendEmail
await sp.utility.sendEmail({
    To: [addressString],
    Subject: "This email is about...",
    Body: "Here is the body. <b>It supports html</b>",
    AdditionalHeaders: {
        "content-type": "text/html"
    },
});
```

## resolvePrincipal

Gets information about a principal that matches the specified Search criteria

```TypeScript
import { spfi, SPFx, IPrincipalInfo, PrincipalType, PrincipalSource } from "@pnp/sp";
import "@pnp/sp/sputilities";

const sp = spfi(...);

let principal : IPrincipalInfo = await sp.utility.resolvePrincipal("user@site.com", PrincipalType.User, PrincipalSource.All, true, false, true);

console.log(principal);
```

## searchPrincipals

Gets information about the principals that match the specified Search criteria.

```TypeScript
import { spfi, SPFx, IPrincipalInfo, PrincipalType, PrincipalSource } from "@pnp/sp";
import "@pnp/sp/sputilities";

const sp = spfi(...);

let principals : IPrincipalInfo[] = await sp.utility.searchPrincipals("john", PrincipalType.User, PrincipalSource.All,"", 10);

console.log(principals);
```

## createEmailBodyForInvitation

Gets the external (outside the firewall) URL to a document or resource in a site.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sputilities";

const sp = spfi(...);

let url : string = await sp.utility.createEmailBodyForInvitation("https://contoso.sharepoint.com/sites/dev/SitePages/DevHome.aspx");
console.log(url);
```

## expandGroupsToPrincipals

Resolves the principals contained within the supplied groups

```TypeScript
import { spfi, SPFx, IPrincipalInfo } from "@pnp/sp";
import "@pnp/sp/sputilities";

const sp = spfi(...);

let principals : IPrincipalInfo[] = await sp.utility.expandGroupsToPrincipals(["Dev Owners", "Dev Members"]);
console.log(principals);

// optionally supply a max results count. Default is 30.
let principals : IPrincipalInfo[] = await sp.utility.expandGroupsToPrincipals(["Dev Owners", "Dev Members"], 10);
console.log(principals);
```

## createWikiPage

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sputilities";
import { ICreateWikiPageResult } from "@pnp/sp/sputilities";

const sp = spfi(...);

let newPage : ICreateWikiPageResult = await sp.utility.createWikiPage({
    ServerRelativeUrl: "/sites/dev/SitePages/mynewpage.aspx",
    WikiHtmlContent: "This is my <b>page</b> content. It supports rich html.",
});

// newPage contains the raw data returned by the service
console.log(newPage.data);

// newPage contains a File instance you can use to further update the new page
let file = await newPage.file();
console.log(file);
```
