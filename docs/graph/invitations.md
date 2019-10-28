# @pnp/graph/invitations

The ability invite an external user via the invitation manager

## Create Invitation

Using the invitations.create() you can create an Invitation.
We need the email address of the user being invited and the URL user should be redirected to once the invitation is redeemed (redirect URL).

```TypeScript
import { graph } from "@pnp/graph";

const invitationResult = await graph.invitations.create('external.user@emailadress.com', 'https://tenant.sharepoint.com/sites/redirecturi');

```
