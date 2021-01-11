# 2020 Year End Report

Welcome to our first year in review for PnPjs. This year has marked usage milestones, seen more contributors than ever, and expanded the core maintainers team. But none of this would be possible without everyone's support, and participation - so we start by saying Thank You! We deeply appreciate everyone that has helped us grow and improve the library over the last year.

This year we introduced MSAL clients for node and client side, improved our testing/local development plumbing, and updated the libraries to work with the node 15 module resolution rules.

We fixed 43 reported bugs, answered 131 questions, and made 55 suggested enhancements to the library - all driven by feedback from users and the community.

Planned for release in January 2021 we also undertook the work to enable isolated runtimes, a long requested feature. This allows you to operate on multiple independently configured "roots" such as "sp" or "graph" from the same application. Previously the library was configured globally, so this opens new possibilities for both client and server side scenarios.

Finally we made many tooling and project improvements such as moving to GitHub actions, updating the tests to use MSAL, and exploring ways to enhance the developer experience.

## Usage

In 2020 we tracked steady month/month growth in raw usage measured by requests as well as in the number of tenants deploying the library. Starting the year we were used in 14605 tenants and by December that number grew to XXXX, peaking in November at 20875.

[Tenant usage graph]

These tenants generated 6.1 billion requests to the service in January growing to XXXX, peaking at 10.1 billion requests in November.

[Requests graph]

> These numbers only include public cloud SPO usage, so true usage is even higher than we can track.

## Releases

We continued our monthly release cadence this year as it represents a good pace for addressing issues while not expecting folks to update too often and it keeps each update to a reasonable size. All changes can be tracked in our [change log](https://github.com/pnp/pnpjs/blob/version-2/CHANGELOG.md), updated with each release. You can track our scheduled releases through [project milestones](https://github.com/pnp/pnpjs/milestones), understanding there are occasionally delays. This monthly cadence allows us to ensure bugs do not linger and we continually improve and expand the capabilities of the libraries.

### NPM Package download statistics (@pnp/sp):

| Month    | Count   | *   | Month       | Count  |
| -------- | ------- | --- | ----------- | ------ |
| January  | 100,686 | *   | July        | 36,805 |
| February | 34,437  | *   | August      | 38,897 |
| March    | 34,574  | *   | September   | 45,968 |
| April    | 32,436  | *   | October     | 46,655 |
| May      | 34,482  | *   | November    | 45,511 |
| June     | 34,408  | *   | December    | XXX    |
|          |         |     |             |        |
|          |         |     | Grand Total | XXX    |

With 2020 our total all time downloads of @pnp/sp is now at: XXXXX

> Stats from https://npm-stat.com/

## Future Plans

Looking to the future we will continue to actively grow and improve v2 of the library, guided by feedback and reported issues. Additionally, we are beginning to discuss v3 and doing initial planning and prototyping. The v3 work will continue through 2021 with no currently set release date, though we will keep everyone up to date.

Additionally in 2021 there will be a general focus on improving not just the code but our tooling, build pipeline, and library contributor experience. We will also look at automatic canary releases with each merge, and other improvements.

## New Lead Maintainer

With the close of 2020 we are very excited to announce a new lead maintainer for PnPjs, [Julie Turner](https://github.com/juliemturner)! Julie brings deep expertise with SharePoint Framework, TypeScript, and SharePoint development to the team, coupled with dedication and care in the work.

Over the last year she has gotten more involved with handling releases, responding to issues, and helping to keep the code updated and clean.

We are very lucky to have her working on the project and look forward to seeing her begin to lead the growth and direction for years to come.

## Contributors

As always we have abundant thanks and appreciation for your contributors. Taking your time to help improve PnPjs for the community is massive and valuable to ensure our sustainability. Thank you for all your help in 2020!

<a href="https://github.com/AJIXuMuK" style="margin:10px" title=AJIXuMuK>
    <img src="https://avatars3.githubusercontent.com/u/17036219?v=4" alt="AJIXuMuK" width="50" height="50" />
</a><a href="https://github.com/Ashikpaul" style="margin:10px" title=Ashikpaul>
    <img src="https://avatars2.githubusercontent.com/u/17526871?v=4" alt="Ashikpaul" width="50" height="50" />
</a><a href="https://github.com/cesarhoeflich" style="margin:10px" title=cesarhoeflich>
    <img src="https://avatars0.githubusercontent.com/u/6339165?v=4" alt="cesarhoeflich" width="50" height="50" />
</a><a href="https://github.com/dcashpeterson" style="margin:10px" title=dcashpeterson>
    <img src="https://avatars2.githubusercontent.com/u/45491456?v=4" alt="dcashpeterson" width="50" height="50" />
</a><a href="https://github.com/apps/dependabot" style="margin:10px" title=dependabot[bot]>
    <img src="https://avatars0.githubusercontent.com/in/29110?v=4" alt="dependabot[bot]" width="50" height="50" />
</a><a href="https://github.com/derhallim" style="margin:10px" title=derhallim>
    <img src="https://avatars1.githubusercontent.com/u/7239963?v=4" alt="derhallim" width="50" height="50" />
</a><a href="https://github.com/DRamalho92" style="margin:10px" title=DRamalho92>
    <img src="https://avatars1.githubusercontent.com/u/40799678?v=4" alt="DRamalho92" width="50" height="50" />
</a><a href="https://github.com/f1nzer" style="margin:10px" title=f1nzer>
    <img src="https://avatars3.githubusercontent.com/u/1970236?v=4" alt="f1nzer" width="50" height="50" />
</a><a href="https://github.com/Harshagracy" style="margin:10px" title=Harshagracy>
    <img src="https://avatars3.githubusercontent.com/u/14230498?v=4" alt="Harshagracy" width="50" height="50" />
</a><a href="https://github.com/holylander" style="margin:10px" title=holylander>
    <img src="https://avatars1.githubusercontent.com/u/2032683?v=4" alt="holylander" width="50" height="50" />
</a><a href="https://github.com/hugoabernier" style="margin:10px" title=hugoabernier>
    <img src="https://avatars2.githubusercontent.com/u/13972467?v=4" alt="hugoabernier" width="50" height="50" />
</a><a href="https://github.com/JakeStanger" style="margin:10px" title=JakeStanger>
    <img src="https://avatars0.githubusercontent.com/u/5057870?v=4" alt="JakeStanger" width="50" height="50" />
</a><a href="https://github.com/jaywellings" style="margin:10px" title=jaywellings>
    <img src="https://avatars2.githubusercontent.com/u/1410735?v=4" alt="jaywellings" width="50" height="50" />
</a><a href="https://github.com/JMTeamway" style="margin:10px" title=JMTeamway>
    <img src="https://avatars2.githubusercontent.com/u/42567407?v=4" alt="JMTeamway" width="50" height="50" />
</a><a href="https://github.com/joelfmrodrigues" style="margin:10px" title=joelfmrodrigues>
    <img src="https://avatars3.githubusercontent.com/u/19577724?v=4" alt="joelfmrodrigues" width="50" height="50" />
</a><a href="https://github.com/juliemturner" style="margin:10px" title=juliemturner>
    <img src="https://avatars0.githubusercontent.com/u/7570936?v=4" alt="juliemturner" width="50" height="50" />
</a><a href="https://github.com/jusper-dk" style="margin:10px" title=jusper-dk>
    <img src="https://avatars0.githubusercontent.com/u/27721442?v=4" alt="jusper-dk" width="50" height="50" />
</a><a href="https://github.com/KEMiCZA" style="margin:10px" title=KEMiCZA>
    <img src="https://avatars2.githubusercontent.com/u/3862716?v=4" alt="KEMiCZA" width="50" height="50" />
</a><a href="https://github.com/koltyakov" style="margin:10px" title=koltyakov>
    <img src="https://avatars2.githubusercontent.com/u/7816483?v=4" alt="koltyakov" width="50" height="50" />
</a><a href="https://github.com/kunj-sangani" style="margin:10px" title=kunj-sangani>
    <img src="https://avatars3.githubusercontent.com/u/25693207?v=4" alt="kunj-sangani" width="50" height="50" />
</a><a href="https://github.com/MarkyDeParky" style="margin:10px" title=MarkyDeParky>
    <img src="https://avatars1.githubusercontent.com/u/16799069?v=4" alt="MarkyDeParky" width="50" height="50" />
</a><a href="https://github.com/mikezimm" style="margin:10px" title=mikezimm>
    <img src="https://avatars1.githubusercontent.com/u/49648086?v=4" alt="mikezimm" width="50" height="50" />
</a><a href="https://github.com/mrebuffet" style="margin:10px" title=mrebuffet>
    <img src="https://avatars0.githubusercontent.com/u/3445077?v=4" alt="mrebuffet" width="50" height="50" />
</a><a href="https://github.com/naugtur" style="margin:10px" title=naugtur>
    <img src="https://avatars1.githubusercontent.com/u/509375?v=4" alt="naugtur" width="50" height="50" />
</a><a href="https://github.com/NZainchkovskiy" style="margin:10px" title=NZainchkovskiy>
    <img src="https://avatars0.githubusercontent.com/u/19357901?v=4" alt="NZainchkovskiy" width="50" height="50" />
</a><a href="https://github.com/PaoloPia" style="margin:10px" title=PaoloPia>
    <img src="https://avatars2.githubusercontent.com/u/7582026?v=4" alt="PaoloPia" width="50" height="50" />
</a><a href="https://github.com/patrick-rodgers" style="margin:10px" title=patrick-rodgers>
    <img src="https://avatars3.githubusercontent.com/u/13154702?v=4" alt="patrick-rodgers" width="50" height="50" />
</a><a href="https://github.com/ravichandran-blog" style="margin:10px" title=ravichandran-blog>
    <img src="https://avatars2.githubusercontent.com/u/21125180?v=4" alt="ravichandran-blog" width="50" height="50" />
</a><a href="https://github.com/RoelVB" style="margin:10px" title=RoelVB>
    <img src="https://avatars3.githubusercontent.com/u/10999128?v=4" alt="RoelVB" width="50" height="50" />
</a><a href="https://github.com/siddharth-vaghasia" style="margin:10px" title=siddharth-vaghasia>
    <img src="https://avatars0.githubusercontent.com/u/9557557?v=4" alt="siddharth-vaghasia" width="50" height="50" />
</a><a href="https://github.com/simonagren" style="margin:10px" title=simonagren>
    <img src="https://avatars0.githubusercontent.com/u/16558321?v=4" alt="simonagren" width="50" height="50" />
</a><a href="https://github.com/tavikukko" style="margin:10px" title=tavikukko>
    <img src="https://avatars0.githubusercontent.com/u/2223355?v=4" alt="tavikukko" width="50" height="50" />
</a><a href="https://github.com/ValerasNarbutas" style="margin:10px" title=ValerasNarbutas>
    <img src="https://avatars0.githubusercontent.com/u/16476453?v=4" alt="ValerasNarbutas" width="50" height="50" />
</a>

## Sponsors

We want to thank our sponsors for their continued support in 2020! This year the money went towards helping offset the cost and shipping of hoodies to contributors and sponsors. Your continued generosity makes a big difference in our ability to recognize and reward the folks building PnPjs.

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
</a><a href="https://github.com/VesaJuvonen" style="margin:20px" title="VesaJuvonen">
    <img src="https://avatars0.githubusercontent.com/u/7446437?v=4" alt="VesaJuvonen" width="100" height="100" />
</a><a href="https://github.com/LauraKokkarinen" style="margin:20px" title="LauraKokkarinen">
    <img src="https://avatars0.githubusercontent.com/u/41330990?v=4" alt="LauraKokkarinen" width="100" height="100" />
</a>

## Closing

In closing we want say _Thank You_ to everyone who uses, contributes to, and participates in PnPjs and the SharePoint Patterns and Practices program.

Wishing you the very best for 2021,

The PnPjs Team
