# @pnp/nodejs/spfetchclient

The SPFetchClient is used to authentication to SharePoint as a provider hosted add-in using a client and secret.

```TypeScript
import { SPFetchClient } from "@pnp/nodejs";
import { sp } from "@pnp/sp";

sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new SPFetchClient("{site url}", "{client id}", "{client secret}");
        },
    },
});

// execute a library request as normal
sp.web.get().then(w => {

    console.log(JSON.stringify(w, null, 4));

}).catch(e => {

    console.error(e);
});
```

## Creating a client id and secret

This section outlines how to register for a client id and secret for use in the above code.

### Register An Add-In

Before you can begin running tests you need to register a low-trust add-in with SharePoint. This is primarily designed for Office 365, but can work on-premises if you [configure you farm accordingly](https://msdn.microsoft.com/en-us/library/office/dn155905.aspx).

1. Navigation to {site url}/_layouts/appregnew.aspx
2. Click "Generate" for both the Client Id and Secret values
3. Give you add-in a title, this can be anything but will let you locate it in the list of add-in permissions
4. Provide a fake value for app domain and redirect uri, you can use the values shown in the examples
5. Click "Create"
6. Copy the returned block of text containing the client id and secret as well as app name for your records and later in this article.

### Grant Your Add-In Permissions

Now that we have created an add-in registration we need to tell SharePoint what permissions it can use. Due to an update in SharePoint Online you now have to [register add-ins with certain permissions in the admin site](https://msdn.microsoft.com/en-us/pnp_articles/how-to-provide-add-in-app-only-tenant-administrative-permissions-in-sharepoint-online).

1. Navigate to {admin site url}/_layouts/appinv.aspx
2. Paste your client id from the above section into the Add Id box and click "Lookup"
3. You should see the information populated into the form from the last section, if not ensure you have the correct id value
4. Paste the below XML into the permissions request xml box and hit "Create"
5. You should get a confirmation message.

```XML
  <AppPermissionRequests AllowAppOnlyPolicy="true">
    <AppPermissionRequest Scope="http://sharepoint/content/tenant" Right="FullControl" />
    <AppPermissionRequest Scope="http://sharepoint/social/tenant" Right="FullControl" />
    <AppPermissionRequest Scope="http://sharepoint/search" Right="QueryAsUserIgnoreAppPrincipal" />
  </AppPermissionRequests>
```

**Note that the above XML will grant full tenant control, you should grant only those permissions necessary for your application**
