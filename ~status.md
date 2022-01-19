// TODO:: have a sample showing how to have a large timeline configuration wrapped in a single behavior including auth, central logging, etc and a way to share that across projects
// TODO:: how do we feel about spfi spFI and graphfi? graphFI Once we release, hard to change.
// TODO:: remove status files
// TODO:: final review of todos
// TODO:: IA for docs, what is missing, what can go, what needs updated, what needs fully re-written?
// TODO:: Let's talk through what it means for people to add behaviors and come up with some guidelines for what we will include in the library. package size is a big win, let's not give it away.
// TODO:: community extensions package for behaviors and library extensions
// TODO:: drop -commonjs packages?
// TODO:: update https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/guidance/use-sp-pnp-js-with-spfx-web-parts


// TODO:: discuss:
     const data = await graphPost<IInvitationType>(this, body(postBody));
     IF you do a batched request it doesn't work right now with batching since the "this" ends up as the original object passed in here.
     Need to figure out a way to resolve that....chained promises?
    This affects SP and graph for both registeration promises and result promises - so we need a way to handle multiple of these things

## experiments:

- Aggressive local browser caching through DB storage behavior. Key is hash of request and data is just the json. On by default for everyone.
