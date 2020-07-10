# What Authentication Should I Use???

This flowchat should help you determine what authentication should work best for your scenario.

```mermaid
flowchart TB
    start((Start))
    
    start-->where([Where are you deploying code?])

    where-->|client|client([How are you deploying?])
    Client-->|SPFx|spfx([What are you connecting to?])
    Client-->|SPA|spa([What are you connecting to?])

    what





    spfx-->|Current User|cu[Here is a thing]
    spfx-->|MSAL|msla
    spfx-->|ADAL|adal

    where-->|Server|server([What are you connecting to?])
    server-->|MSAL



```

- spfx
  - Current User
  - MSAL
  - ADAL
- spa
  - MSAL

- nodejs
  - MSAL
  - SharePoint App Registration
  - ADAL

