# 2022 Year End Report

Wow, what a year for [PnPjs](https://github.com/pnp/pnpjs)! We released our latest major version 3.0 on Valentine's Day 2022 which included significant performance improvements, a completely rewritten internal architecture, and reduced the bundled library size by two-thirds. As well we continued out monthly releases bringing enhancements and bug fixes to our users on a continual basis.

But before we go any further we once again say **Thank You!!!** to everyone that has used, contributed to, and provided feedback on the library. This journey is not possible without you, and this last year you have driven us to be our best.

Version 3 introduces a completely new design for the internals of the library, easily allowing consumers to customize any part of the request process to their needs. Centered around an extensible [Timeline](https://github.com/pnp/pnpjs/blob/version-3/packages/core/timeline.ts#L126) and extended for http requests by [Queryable](https://github.com/pnp/pnpjs/blob/version-3/packages/queryable/queryable.ts#L34) this new pattern reduced code duplication, interlock, and complexity significantly. It allows everything in the request flow to be controlled through [behaviors](https://pnp.github.io/pnpjs/core/behaviors/), which are plain functions acting at the various stages of the request. Using this model we reimagined batching, caching, authentication, and parsing in simpler, composable ways. If you have not yet updated to version 3, we encourage you to do so. You can review the [transition guide](https://pnp.github.io/pnpjs/transition-guide/) to get started.

As one last treat, we set up nightly builds so that each day you can get a fresh version with any updates merged the previous day. This is super helpful if you're waiting for a specific fix or feature for your project. It allows for easier testing of new features through the full dev lifecycle, as well.

In other news, we fixed 54 reported bugs, answered 123 questions, and made 54 suggested enhancements to version 3 of the library - all driven by feedback from users and the community.

## Usage

In 2022 we continued to see steady usage and growth maintaining a requst/month rate over 30 billion for much of the year. These requets came from ~29K tenants a month, including some of our largest M365 customers.

![Graph showing requests and tenants/month for @pnp/sp](../img/usage-2022-eoy.png)

## Releases

We continued our monthly release cadence as it represents a good pace for addressing issues while not expecting folks to update too often and keeping each update to a reasonable size. All changes can be tracked in our [change log](https://github.com/pnp/pnpjs/blob/main/CHANGELOG.md), updated with each release. You can check our scheduled releases through [project milestones](https://github.com/pnp/pnpjs/milestones), understanding there are occasionally delays. Monthly releases allows us to ensure bugs do not linger and we continually improve and expand the capabilities of the libraries.

### NPM Package download statistics (@pnp/sp)

| Month    | Count   | *   | Month       | Count  |
| -------- | ------- | --- | ----------- | ------ |
| January  | 70,863  | *   | July        | 63,844 |
| February | 76,649  | *   | August      | 75,713 |
| March    | 83,902  | *   | September   | 71,447 |
| April    | 70,429  | *   | October     | 84,744 |
| May      | 72,406  | *   | November    | 82,459 |
| June     | 71,375  | *   | December    | 65,785 |
|          |         |     |             |        |
|          |         |     | Grand Total | 889,616|

For comparison our total downloads in 2021 was 793,747.

With 2022 our total all time downloads of @pnp/sp is now at: 2,543,639

In 2021 the all time total was 1,743,385.

> Stats from <https://npm-stat.com/>

## Future Plans

Looking to the future we will continue to actively grow and improve v3 of the library, guided by feedback and reported issues. Additionally, we are looking to expand our contributions documentation to make it easier for community members to contibute their ideas and updates to the library.

## Contributors

As always we have abundant thanks and appreciation for your contributors. Taking your time to help improve PnPjs for the community is massive and valuable to ensure our sustainability. Thank you for all your help in 2021! If you are interested in becoming a contributor [check out our guide](../contributing/index.md) on ways to get started.

<a href="https://github.com/juliemturner" style="margin:10px" title="juliemturner">
    <img src="https://avatars.githubusercontent.com/u/7570936?v=4" alt="juliemturner" width="50" height="50" />
</a><a href="https://github.com/tavikukko" style="margin:10px" title="tavikukko">
    <img src="https://avatars.githubusercontent.com/u/2223355?v=4" alt="tavikukko" width="50" height="50" />
</a><a href="https://github.com/michael-ra" style="margin:10px" title="michael-ra">
    <img src="https://avatars.githubusercontent.com/u/72650525?v=4" alt="michael-ra" width="50" height="50" />
</a><a href="https://github.com/dylanbr0wn" style="margin:10px" title="dylanbr0wn">
    <img src="https://avatars.githubusercontent.com/u/40218657?v=4" alt="dylanbr0wn" width="50" height="50" />
</a><a href="https://github.com/wilecoyotegenius" style="margin:10px" title="wilecoyotegenius">
    <img src="https://avatars.githubusercontent.com/u/22167638?v=4" alt="wilecoyotegenius" width="50" height="50" />
</a><a href="https://github.com/wmertens" style="margin:10px" title="wmertens">
    <img src="https://avatars.githubusercontent.com/u/54934?v=4" alt="wmertens" width="50" height="50" />
</a><a href="https://github.com/Taaqif" style="margin:10px" title="Taaqif">
    <img src="https://avatars.githubusercontent.com/u/1954204?v=4" alt="Taaqif" width="50" height="50" />
</a><a href="https://github.com/aaademosu" style="margin:10px" title="aaademosu">
    <img src="https://avatars.githubusercontent.com/u/2017630?v=4" alt="aaademosu" width="50" height="50" />
</a><a href="https://github.com/martinlingstuyl" style="margin:10px" title="martinlingstuyl">
    <img src="https://avatars.githubusercontent.com/u/5267487?v=4" alt="martinlingstuyl" width="50" height="50" />
</a><a href="https://github.com/Saintenr" style="margin:10px" title="Saintenr">
    <img src="https://avatars.githubusercontent.com/u/33520976?v=4" alt="Saintenr" width="50" height="50" />
</a><a href="https://github.com/sympmarc" style="margin:10px" title="sympmarc">
    <img src="https://avatars.githubusercontent.com/u/1295627?v=4" alt="sympmarc" width="50" height="50" />
</a><a href="https://github.com/DmitriyVdE" style="margin:10px" title="DmitriyVdE">
    <img src="https://avatars.githubusercontent.com/u/43698501?v=4" alt="DmitriyVdE" width="50" height="50" />
</a><a href="https://github.com/milanholemans" style="margin:10px" title="milanholemans">
    <img src="https://avatars.githubusercontent.com/u/11723921?v=4" alt="milanholemans" width="50" height="50" />
</a><a href="https://github.com/amartyadav" style="margin:10px" title="amartyadav">
    <img src="https://avatars.githubusercontent.com/u/43371153?v=4" alt="amartyadav" width="50" height="50" />
</a><a href="https://github.com/andreasmarkussen" style="margin:10px" title="andreasmarkussen">
    <img src="https://avatars.githubusercontent.com/u/6911804?v=4" alt="andreasmarkussen" width="50" height="50" />
</a><a href="https://github.com/LuiseFreese" style="margin:10px" title="LuiseFreese">
    <img src="https://avatars.githubusercontent.com/u/49960482?v=4" alt="LuiseFreese" width="50" height="50" />
</a><a href="https://github.com/SuperioOne" style="margin:10px" title="SuperioOne">
    <img src="https://avatars.githubusercontent.com/u/44144974?v=4" alt="SuperioOne" width="50" height="50" />
</a><a href="https://github.com/waldekmastykarz" style="margin:10px" title="waldekmastykarz">
    <img src="https://avatars.githubusercontent.com/u/11164679?v=4" alt="waldekmastykarz" width="50" height="50" />
</a><a href="https://github.com/robert-lindstrom" style="margin:10px" title="robert-lindstrom">
    <img src="https://avatars.githubusercontent.com/u/45068174?v=4" alt="robert-lindstrom" width="50" height="50" />
</a><a href="https://github.com/JakeStanger" style="margin:10px" title="JakeStanger">
    <img src="https://avatars.githubusercontent.com/u/5057870?v=4" alt="JakeStanger" width="50" height="50" />
</a>

## Sponsors

We want to thank our sponsors for their support in 2020! This year we put the money towards helping offset the cost and shipping of hoodies to contributors and sponsors. Your continued generosity makes a big difference in our ability to recognize and reward the folks building PnPjs.

**Thank You**

<a href="https://github.com/KEMiCZA" style="margin:20px" title="KEMiCZA">
    <img src="https://avatars0.githubusercontent.com/u/3862716?v=4" alt="KEMiCZA" width="100" height="100" />
</a><a href="https://github.com/Sympraxis-Consulting" style="margin:20px" title="Sympraxis Consulting">
    <img src="https://avatars3.githubusercontent.com/u/19271832?v=4" alt="Sympraxis Consulting" width="100" height="100" />
</a><a href="https://github.com/thechriskent" style="margin:20px" title="thechriskent">
    <img src="https://avatars0.githubusercontent.com/u/8364109?v=4" alt="thechriskent" width="100" height="100" />
</a><a href="https://github.com/erwinvanhunen" style="margin:20px" title="erwinvanhunen">
    <img src="https://avatars0.githubusercontent.com/u/7666381?v=4" alt="erwinvanhunen" width="100" height="100" />
</a><a href="https://github.com/PopWarner" style="margin:20px" title="PopWarner">
    <img src="https://avatars0.githubusercontent.com/u/10676147?v=4" alt="PopWarner" width="100" height="100" />
</a><a href="https://github.com/jansenbe" style="margin:20px" title="jansenbe">
    <img src="https://avatars.githubusercontent.com/u/7451219?v=4" alt="jansenbe" width="100" height="100" />
</a><a href="https://github.com/YannickRe" style="margin:20px" title="YannickRe">
    <img src="https://avatars.githubusercontent.com/u/9973962?v=4" alt="YannickRe" width="100" height="100" />
</a>

## Closing

In closing we want say _Thank You_ to everyone who uses, contributes to, and participates in PnPjs and the SharePoint Patterns and Practices program.

Wishing you the very best for 2023,

The PnPjs Team
