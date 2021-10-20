// TODO:: I removed many of the unused locals and other checks in tsconfig.json. Need to reset to stricter values. Use the one in v2 branch as a template
// TODO:: have a sample showing how to have a large timeline configuration wrapped in a single behavior including auth, central logging, etc and a way to share that across projects
// TODO:: do we want to move to .env files, seems to be a sorta "norm" folks are using?
// TODO:: maintain an experimental release
// TODO:: need to update our /samples and maybe more? remove rollup sample
// TODO:: kebab-case all file names

## experiments:

- Aggressive local browser caching through DB storage behavior. Key is hash of request and data is just the json. On by default for everyone.


Need shorthand for this: .using(FromQueryable(this)), 
