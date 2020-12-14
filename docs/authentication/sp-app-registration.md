# Legacy SharePoint App Registration

This section outlines how to register for a client id and secret for use in the above code.

> Due to a recent change in how SPO is configured NEW tenants will have ACS authentication _disabled_ by default. You can read more [details in this article](https://docs.microsoft.com/en-us/sharepoint/dev/solution-guidance/security-apponly-azureacs). For testing we recommend using [MSAL Certificate Authentication](./server-nodejs.md#call-sharepoint).

## Register An Add-In

Before you can begin running tests you need to register a low-trust add-in with SharePoint. This is primarily designed for Office 365, but can work on-premises if you [configure your farm accordingly](https://msdn.microsoft.com/en-us/library/office/dn155905.aspx).

1. Navigation to {site url}/_layouts/appregnew.aspx
1. Click "Generate" for both the Client Id and Secret values
1. Give you add-in a title, this can be anything but will let you locate it in the list of add-in permissions
1. Provide a fake value for app domain and redirect uri
1. Click "Create"
1. Copy the returned block of text containing the client id and secret as well as app name for your records and later in this article.

## Grant Your Add-In Permissions

Now that we have created an add-in registration we need to tell SharePoint what permissions it can use. Due to an update in SharePoint Online you now have to [register add-ins with certain permissions in the admin site](https://msdn.microsoft.com/en-us/pnp_articles/how-to-provide-add-in-app-only-tenant-administrative-permissions-in-sharepoint-online).

1. Navigate to {admin site url}/_layouts/appinv.aspx
1. Paste your client id from the above section into the App Id box and click "Lookup"
1. You should see the information populated into the form from the last section, if not ensure you have the correct id value
1. Paste the below XML into the permissions request xml box and hit "Create"
1. You should get a confirmation message.

```XML
  <AppPermissionRequests AllowAppOnlyPolicy="true">
    <AppPermissionRequest Scope="http://sharepoint/content/tenant" Right="FullControl" />
    <AppPermissionRequest Scope="http://sharepoint/social/tenant" Right="FullControl" />
    <AppPermissionRequest Scope="http://sharepoint/search" Right="QueryAsUserIgnoreAppPrincipal" />
  </AppPermissionRequests>
```

**Note that the above XML will grant full tenant control. This is OK for testing, but you should grant only those permissions necessary for your application in production.**
