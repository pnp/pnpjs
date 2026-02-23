# @pnp/graph/contacts

The ability to manage contacts and folders in Outlook is a capability introduced in version 1.2.2 of @pnp/graphfi(). Through the methods described
you can add and edit both contacts and folders in a users Outlook.

More information can be found in the official Graph documentation:

- [Contact Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/contact?view=graph-rest-1.0)

## IContact, IContacts, IContactFolder, IContactFolders

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Set up notes

To make user calls you can use getById where the id is the users email address.
Contact ID, Folder ID, and Parent Folder ID use the following format "AAMkADY1OTQ5MTM0LTU2OTktNDI0Yy1iODFjLWNiY2RmMzNjODUxYwBGAAAAAAC75QV12PBiRIjb8MNVIrJrBwBgs0NT6NreR57m1u_D8SpPAAAAAAEOAABgs0NT6NreR57m1u_D8SpPAAFCCnApAAA="

## Get all of the Contacts

Gets a list of all the contacts for the user.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users"
import "@pnp/graph/contacts"

const graph = graphfi(...);

const contacts = await graph.users.getById('user@tenant.onmicrosoft.com').contacts();

const contacts2 = await graph.me.contacts();

```

## Get Contact by Id

Gets a specific contact by ID for the user.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/contacts";

const graph = graphfi(...);

const contactID = "AAMkADY1OTQ5MTM0LTU2OTktNDI0Yy1iODFjLWNiY2RmMzNjODUxYwBGAAAAAAC75QV12PBiRIjb8MNVIrJrBwBgs0NT6NreR57m1u_D8SpPAAAAAAEOAABgs0NT6NreR57m1u_D8SpPAAFCCnApAAA=";

const contact = await graph.users.getById('user@tenant.onmicrosoft.com').contacts.getById(contactID)();

const contact2 = await graph.me.contacts.getById(contactID)();

```

## Add a new Contact

Adds a new contact for the user.

```TypeScript
import { graphfi } from "@pnp/graph";
import { EmailAddress } from "@microsoft/microsoft-graph-types";
import "@pnp/graph/users";
import "@pnp/graph/contacts";

const graph = graphfi(...);

const addedContact = await graph.users.getById('user@tenant.onmicrosoft.com').contacts.add('Pavel', 'Bansky', [<EmailAddress>{address: 'pavelb@fabrikam.onmicrosoft.com', name: 'Pavel Bansky' }], ['+1 732 555 0102']);

const addedContact2 = await graph.me.contacts.add('Pavel', 'Bansky', [<EmailAddress>{address: 'pavelb@fabrikam.onmicrosoft.com', name: 'Pavel Bansky' }], ['+1 732 555 0102']);

```

## Update a Contact

Updates a specific contact by ID for teh designated user

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/contacts";

const graph = graphfi(...);

const contactID = "AAMkADY1OTQ5MTM0LTU2OTktNDI0Yy1iODFjLWNiY2RmMzNjODUxYwBGAAAAAAC75QV12PBiRIjb8MNVIrJrBwBgs0NT6NreR57m1u_D8SpPAAAAAAEOAABgs0NT6NreR57m1u_D8SpPAAFCCnApAAA=";

const updContact = await graph.users.getById('user@tenant.onmicrosoft.com').contacts.getById(contactID).update({birthday: "1986-05-30" });

const updContact2 = await graph.me.contacts.getById(contactID).update({birthday: "1986-05-30" });

```

## Delete a Contact

Delete a contact from the list of contacts for a user.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/contacts";

const graph = graphfi(...);

const contactID = "AAMkADY1OTQ5MTM0LTU2OTktNDI0Yy1iODFjLWNiY2RmMzNjODUxYwBGAAAAAAC75QV12PBiRIjb8MNVIrJrBwBgs0NT6NreR57m1u_D8SpPAAAAAAEOAABgs0NT6NreR57m1u_D8SpPAAFCCnApAAA=";

const delContact = await graph.users.getById('user@tenant.onmicrosoft.com').contacts.getById(contactID).delete();

const delContact2 = await graph.me.contacts.getById(contactID).delete();

```

## Get all of the Contact Folders

Get all the folders for the designated user's contacts

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/contacts";

const graph = graphfi(...);

const contactFolders = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders();

const contactFolders2 = await graph.me.contactFolders();

```

## Get Contact Folder by Id

Get a contact folder by ID for the specified user

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/contacts";

const graph = graphfi(...);

const folderID = "AAMkADY1OTQ5MTM0LTU2OTktNDI0Yy1iODFjLWNiY2RmMzNjODUxYwAuAAAAAAC75QV12PBiRIjb8MNVIrJrAQBgs0NT6NreR57m1u_D8SpPAAFCCqH9AAA=";

const contactFolder = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById(folderID)();

const contactFolder2 = await graph.me.contactFolders.getById(folderID)();

```

## Add a new Contact Folder

Add a new folder in the users contacts

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/contacts";

const graph = graphfi(...);

const parentFolderID = "AAMkADY1OTQ5MTM0LTU2OTktNDI0Yy1iODFjLWNiY2RmMzNjODUxYwAuAAAAAAC75QV12PBiRIjb8MNVIrJrAQBgs0NT6NreR57m1u_D8SpPAAAAAAEOAAA=";

const addedContactFolder = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.add("New Folder", parentFolderID);

const addedContactFolder2 = await graph.me.contactFolders.add("New Folder", parentFolderID);

```

## Update a Contact Folder

Update an existing folder in the users contacts

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/contacts";

const graph = graphfi(...);

const folderID = "AAMkADY1OTQ5MTM0LTU2OTktNDI0Yy1iODFjLWNiY2RmMzNjODUxYwAuAAAAAAC75QV12PBiRIjb8MNVIrJrAQBgs0NT6NreR57m1u_D8SpPAAFCCqH9AAA=";

const updContactFolder = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById(folderID).update({displayName: "Updated Folder" });

const updContactFolder2 = await graph.me.contactFolders.getById(folderID).update({displayName: "Updated Folder" });

```

## Delete a Contact Folder

Delete a folder from the users contacts list. Deleting a folder deletes the contacts in that folder.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/contacts";

const graph = graphfi(...);

const folderID = "AAMkADY1OTQ5MTM0LTU2OTktNDI0Yy1iODFjLWNiY2RmMzNjODUxYwAuAAAAAAC75QV12PBiRIjb8MNVIrJrAQBgs0NT6NreR57m1u_D8SpPAAFCCqH9AAA=";

const delContactFolder = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById(folderID).delete();

const delContactFolder2 = await graph.me.contactFolders.getById(folderID).delete();

```

## Get all of the Contacts from the Contact Folder

Get all the contacts in a folder

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/contacts";

const graph = graphfi(...);

const folderID = "AAMkADY1OTQ5MTM0LTU2OTktNDI0Yy1iODFjLWNiY2RmMzNjODUxYwAuAAAAAAC75QV12PBiRIjb8MNVIrJrAQBgs0NT6NreR57m1u_D8SpPAAFCCqH9AAA=";

const contactsInContactFolder = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById(folderID).contacts();

const contactsInContactFolder2 = await graph.me.contactFolders.getById(folderID).contacts();

```

## Get Child Folders of the Contact Folder

Get child folders from contact folder

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/contacts";

const graph = graphfi(...);

const folderID = "AAMkADY1OTQ5MTM0LTU2OTktNDI0Yy1iODFjLWNiY2RmMzNjODUxYwAuAAAAAAC75QV12PBiRIjb8MNVIrJrAQBgs0NT6NreR57m1u_D8SpPAAFCCqH9AAA=";

const childFolders = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById(folderID).childFolders();

const childFolders2 = await graph.me.contactFolders.getById(folderID).childFolders();

```

## Add a new Child Folder

Add a new child folder to a contact folder

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/contacts";

const graph = graphfi(...);

const folderID = "AAMkADY1OTQ5MTM0LTU2OTktNDI0Yy1iODFjLWNiY2RmMzNjODUxYwAuAAAAAAC75QV12PBiRIjb8MNVIrJrAQBgs0NT6NreR57m1u_D8SpPAAFCCqH9AAA=";

const addedChildFolder = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById(folderID).childFolders.add("Sub Folder", folderID);

const addedChildFolder2 = await graph.me.contactFolders.getById(folderID).childFolders.add("Sub Folder", folderID);
```

## Get Child Folder by Id

Get child folder by ID from user contacts

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/contacts";

const graph = graphfi(...);

const folderID = "AAMkADY1OTQ5MTM0LTU2OTktNDI0Yy1iODFjLWNiY2RmMzNjODUxYwAuAAAAAAC75QV12PBiRIjb8MNVIrJrAQBgs0NT6NreR57m1u_D8SpPAAFCCqH9AAA=";
const subFolderID = "AAMkADY1OTQ5MTM0LTU2OTktNDI0Yy1iODFjLWNiY2RmMzNjODUxYwAuAAAAAAC75QV12PBiRIjb8MNVIrJrAQBgs0NT6NreR57m1u_D8SpPAAFCCqIZAAA=";

const childFolder = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById(folderID).childFolders.getById(subFolderID)();

const childFolder2 = await graph.me.contactFolders.getById(folderID).childFolders.getById(subFolderID)();
```

## Add Contact in Child Folder of Contact Folder

Add a new contact to a child folder

```TypeScript
import { graphfi } from "@pnp/graph";
import { EmailAddress } from "./@microsoft/microsoft-graph-types";
import "@pnp/graph/users";
import "@pnp/graph/contacts";

const graph = graphfi(...);

const folderID = "AAMkADY1OTQ5MTM0LTU2OTktNDI0Yy1iODFjLWNiY2RmMzNjODUxYwAuAAAAAAC75QV12PBiRIjb8MNVIrJrAQBgs0NT6NreR57m1u_D8SpPAAFCCqH9AAA=";
const subFolderID = "AAMkADY1OTQ5MTM0LTU2OTktNDI0Yy1iODFjLWNiY2RmMzNjODUxYwAuAAAAAAC75QV12PBiRIjb8MNVIrJrAQBgs0NT6NreR57m1u_D8SpPAAFCCqIZAAA=";

const addedContact = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById(folderID).childFolders.getById(subFolderID).contacts.add('Pavel', 'Bansky', [<EmailAddress>{address: 'pavelb@fabrikam.onmicrosoft.com', name: 'Pavel Bansky' }], ['+1 732 555 0102']);

const addedContact2 = await graph.me.contactFolders.getById(folderID).childFolders.getById(subFolderID).contacts.add('Pavel', 'Bansky', [<EmailAddress>{address: 'pavelb@fabrikam.onmicrosoft.com', name: 'Pavel Bansky' }], ['+1 732 555 0102']);

```
