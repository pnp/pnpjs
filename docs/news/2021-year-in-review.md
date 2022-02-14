# 2021 Year End Report

Welcome to our second year in review report for PnPjs. 2021 found us planning, building, testing, and documenting a whole new version of PnPjs. The goal is to deliver a much improved and flexible experience and none of that would have been possible without the support and participation of everyone in the PnP community - so we start by saying Thank You! We deeply appreciate everyone that has used, helped us grow, and improved the library over the last year.

Because of the huge useage we've seen with the library and issues we found implementing some of the much requested enhancements, we felt we really needed to start from the ground up and rearchitect the library completely. This new design, built on the concept of a "Timeline", enabled us to build a significantly lighter weight solution that is more extensible than ever. And bonus, we were able to keep the overall development experience largly unchanged, so that makes transitioning all that much easier. In addition we took extra effort to validate our development efforts by making sure all our tests passed so that we could better ensure quality of the library. Check out our [Transition Guide](../transition-guide.md) and [ChangeLog](https://github.com/pnp/pnpjs/blob/version-3/CHANGELOG.md) for all the details.

In other news, we fixed 47 reported bugs, answered 89 questions, and made 51 suggested enhancements to version 2 of the library - all driven by feedback from users and the community.

## Usage

In 2021 we transitioned from rapid growth to slower growth but maintaining a request/month rate over 11 billion, approaching 13 billion by the end of the year. These requests came from more than 25 thousand tenants including some of the largest M365 customers. Due to some data cleanup we don't have the full year's information, but the below graph shows the final 7 months of the year.

![Graph showing requests and tenants/month for @pnp/sp](../img/usage-2021-eoy.png)

## Releases

We continued our monthly release cadence as it represents a good pace for addressing issues while not expecting folks to update too often and keeping each update to a reasonable size. All changes can be tracked in our [change log](https://github.com/pnp/pnpjs/blob/main/CHANGELOG.md), updated with each release. You can check our scheduled releases through [project milestones](https://github.com/pnp/pnpjs/milestones), understanding there are occasionally delays. Monthly releases allows us to ensure bugs do not linger and we continually improve and expand the capabilities of the libraries.

### NPM Package download statistics (@pnp/sp)

| Month    | Count   | *   | Month       | Count  |
| -------- | ------- | --- | ----------- | ------ |
| January  | 49,446  | *   | July        | 73,491 |
| February | 56,054  | *   | August      | 74,236 |
| March    | 66,113  | *   | September   | 69,179 |
| April    | 58,526  | *   | October     | 77,645 |
| May      | 62,747  | *   | November    | 74,966 |
| June     | 69,349  | *   | December    | 61,995 |
|          |         |     |             |        |
|          |         |     | Grand Total | 793,747|

For comparison our total downloads in 2020 was 543,836.

With 2021 our total all time downloads of @pnp/sp is now at: 1,743,385

In 2020 the all time total was 949,638.

> Stats from <https://npm-stat.com/>

## Future Plans

Looking to the future we will continue to actively grow and improve v3 of the library, guided by feedback and reported issues. Additionally, we are looking to expand our contributions documentation to make it easier for community members to contibute their ideas and updates to the library.

## Contributors

As always we have abundant thanks and appreciation for your contributors. Taking your time to help improve PnPjs for the community is massive and valuable to ensure our sustainability. Thank you for all your help in 2020! If you are interested in becoming a contributor [check out our guide](../contributing/index.md) on ways to get started.

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
</a><a href="https://github.com/VesaJuvonen" style="margin:20px" title="VesaJuvonen">
    <img src="https://avatars0.githubusercontent.com/u/7446437?v=4" alt="VesaJuvonen" width="100" height="100" />
</a><a href="https://github.com/LauraKokkarinen" style="margin:20px" title="LauraKokkarinen">
    <img src="https://avatars0.githubusercontent.com/u/41330990?v=4" alt="LauraKokkarinen" width="100" height="100" />
</a><a href="https://github.com/ricardocarneiro" style="margin:20px" title="ricardocarneiro">
    <img src="https://avatars0.githubusercontent.com/u/4666947?v=4" alt="ricardocarneiro" width="100" height="100" />
</a><a href="https://github.com/andrewconnell" style="margin:20px" title="andrewconnell">
    <img src="https://avatars0.githubusercontent.com/u/2068657?v=4" alt="andrewconnell" width="100" height="100" />
</a>

## Closing

In closing we want say _Thank You_ to everyone who uses, contributes to, and participates in PnPjs and the SharePoint Patterns and Practices program.

Wishing you the very best for 2022,

The PnPjs Team
