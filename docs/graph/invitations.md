# @pnp/graph/invitations

The ability invite an external user via the invitation manager

## IInvitations

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

| Scenario    | Import Statement                                                  |
| ----------- | ----------------------------------------------------------------- |
| Selective   | import { graph } from "@pnp/graph";<br />import "@pnp/graph/invitations"; |
| Preset: All | import "@pnp/graph/presets/all";    |

## Create Invitation

Using the invitations.create() you can create an Invitation.
We need the email address of the user being invited and the URL user should be redirected to once the invitation is redeemed (redirect URL).

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/invitations"

const invitationResult = await graph.invitations.create('external.user@email-address.com', 'https://tenant.sharepoint.com/sites/redirecturi');

```
