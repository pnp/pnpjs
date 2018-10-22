import { extend, hOP } from "@pnp/common";
import { PrincipalType } from "@pnp/sp";
import { expect } from "chai";
import { sp } from "../";
import { testSettings } from "../../../test/main";

function checkProps<T>(props: T) {
    return props;
}
function extendWithODataProps<T, E, I, M, J>(target: T, source: { "odata.editLink": E, "odata.id": I, "odata.metadata": M, "odata.type": J }) {
    return extend(target, {
        "odata.editLink": source["odata.editLink"],
        "odata.id": source["odata.id"],
        "odata.metadata": source["odata.metadata"],
        "odata.type": source["odata.type"],
    });
}

describe("WebQueryableInterface", () => {

    if (testSettings.enableWebTests) {

        describe("default get", () => {
            it("should get the base object with default props", function () {
                const expected = {
                    AllowRssFeeds: false,
                    AlternateCssUrl: "",
                    AppInstanceId: "",
                    Configuration: 0,
                    Created: "",
                    CurrentChangeToken: {StringValue: ""},
                    CustomMasterUrl: "",
                    Description: "",
                    DesignPackageId: "",
                    DocumentLibraryCalloutOfficeWebAppPreviewersDisabled: false,
                    EnableMinimalDownload: false,
                    FooterEnabled: false,
                    HeaderEmphasis: 0,
                    HeaderLayout: 0,
                    HorizontalQuickLaunch: false,
                    Id: "",
                    IsMultilingual: false,
                    Language: 0,
                    LastItemModifiedDate: "",
                    LastItemUserModifiedDate: "",
                    MasterUrl: "",
                    MegaMenuEnabled: false,
                    NoCrawl: false,
                    ObjectCacheEnabled: false,
                    OverwriteTranslationsOnChange: false,
                    QuickLaunchEnabled: false,
                    RecycleBinEnabled: false,
                    ResourcePath: {DecodedUrl: ""},
                    ServerRelativeUrl: "",
                    SiteLogoUrl: "",
                    SyndicationEnabled: false,
                    Title: "",
                    TreeViewEnabled: false,
                    UIVersion: 0,
                    UIVersionConfigurationEnabled: false,
                    Url: "",
                    WebTemplate: "",
                    WelcomePage: "",
                    "odata.editLink": "",
                    "odata.id": "",
                    "odata.metadata": "",
                    "odata.type": "SP.Web" as "SP.Web",
                };
                return expect(sp.web.stronglyTyped().get().then(web => {
                    // use 'typeof web' to check if the TS type has more properties than we selected at compile time
                    checkProps<typeof web>(expected);
                    checkProps<typeof expected>(web);
                    extend(expected, web, false, prop => hOP(expected, prop));
                    return web;
                })).to.eventually.deep.equal(expected);
            });
        });

        describe("select default", () => {
            it("should get a projection with selected props from default props", function () {
                const expected = {
                    Title: "",
                    Url: "",
                    WelcomePage: "",
                    "odata.editLink": "",
                    "odata.id": "",
                    "odata.metadata": "",
                    "odata.type": "SP.Web" as "SP.Web",
                };
                return expect(sp.web.stronglyTyped().select("Title", "Url", "WelcomePage").get().then(web => {
                    checkProps<typeof web>(expected);
                    checkProps<typeof expected>(web);
                    extend(expected, web, false, prop => hOP(expected, prop));
                    return web;
                })).to.eventually.deep.equal(expected);
            });
        });

        describe("select non-default", () => {
            it("should get a projection with selected props from non-default props", function () {
                const expected = {
                    AllowAutomaticASPXPageIndexing: false,
                    SaveSiteAsTemplateEnabled: false,
                    "odata.editLink": "",
                    "odata.id": "",
                    "odata.metadata": "",
                    "odata.type": "SP.Web" as "SP.Web",
                };
                return expect(sp.web.stronglyTyped().select("AllowAutomaticASPXPageIndexing", "SaveSiteAsTemplateEnabled").get().then(web => {
                    checkProps<typeof web>(expected);
                    checkProps<typeof expected>(web);
                    extend(expected, web, false, prop => hOP(expected, prop));
                    return web;
                })).to.eventually.deep.equal(expected);
            });
        });

        describe("select non-expanded base", () => {
            it("should select an odata navigation link", function () {
                const expected = {
                    "CurrentUser@odata.navigationLinkUrl": "",
                    "odata.editLink": "",
                    "odata.id": "",
                    "odata.metadata": "",
                    "odata.type": "SP.Web" as "SP.Web",
                };
                return expect(sp.web.stronglyTyped().select("CurrentUser").get().then(web => {
                    checkProps<typeof web>(expected);
                    checkProps<typeof expected>(web);
                    extend(expected, web, false, prop => hOP(expected, prop));
                    return web;
                })).to.eventually.deep.equal(expected);
            });
        });

        describe("expand with default get", () => {
            it("should get the base object with default props and an expanded prop", function () {
                const expected = {
                    AllowRssFeeds: false,
                    AlternateCssUrl: "",
                    AppInstanceId: "",
                    Configuration: 0,
                    Created: "",
                    CurrentChangeToken: {StringValue: ""},
                    CurrentUser: {
                        Email: "",
                        Id: 0,
                        IsEmailAuthenticationGuestUser: false,
                        IsHiddenInUI: false,
                        IsShareByEmailGuestUser: false,
                        IsSiteAdmin: false,
                        LoginName: "",
                        PrincipalType: PrincipalType.User,
                        Title: "",
                        UserId: {
                            NameId: "",
                            NameIdIssuer: "",
                        },
                        "odata.editLink": "",
                        "odata.id": "",
                        "odata.type": "SP.User" as "SP.User",
                    },
                    "CurrentUser@odata.navigationLinkUrl": "",
                    CustomMasterUrl: "",
                    Description: "",
                    DesignPackageId: "",
                    DocumentLibraryCalloutOfficeWebAppPreviewersDisabled: false,
                    EnableMinimalDownload: false,
                    FooterEnabled: false,
                    HeaderEmphasis: 0,
                    HeaderLayout: 0,
                    HorizontalQuickLaunch: false,
                    Id: "",
                    IsMultilingual: false,
                    Language: 0,
                    LastItemModifiedDate: "",
                    LastItemUserModifiedDate: "",
                    MasterUrl: "",
                    MegaMenuEnabled: false,
                    NoCrawl: false,
                    ObjectCacheEnabled: false,
                    OverwriteTranslationsOnChange: false,
                    QuickLaunchEnabled: false,
                    RecycleBinEnabled: false,
                    ResourcePath: {DecodedUrl: ""},
                    ServerRelativeUrl: "",
                    SiteLogoUrl: "",
                    SyndicationEnabled: false,
                    Title: "",
                    TreeViewEnabled: false,
                    UIVersion: 0,
                    UIVersionConfigurationEnabled: false,
                    Url: "",
                    WebTemplate: "",
                    WelcomePage: "",
                    "odata.editLink": "",
                    "odata.id": "",
                    "odata.metadata": "",
                    "odata.type": "SP.Web" as "SP.Web",
                };
                return expect(sp.web.stronglyTyped().expand("CurrentUser").get().then(web => {
                    checkProps<typeof web>(expected);
                    checkProps<typeof expected>(web);
                    extend(expected, web, false, prop => hOP(expected, prop));
                    return web;
                })).to.eventually.deep.equal(expected);
            });
        });

        describe("expand with root prop select", () => {
            it("should get the base object with selected prop and untouched expanded props", function () {
                const expected = {
                    CurrentUser: {
                        Email: "",
                        Id: 0,
                        IsEmailAuthenticationGuestUser: false,
                        IsHiddenInUI: false,
                        IsShareByEmailGuestUser: false,
                        IsSiteAdmin: false,
                        LoginName: "",
                        PrincipalType: PrincipalType.User,
                        Title: "",
                        UserId: {
                            NameId: "",
                            NameIdIssuer: "",
                        },
                        "odata.editLink": "",
                        "odata.id": "",
                        "odata.type": "SP.User" as "SP.User",
                    },
                    "CurrentUser@odata.navigationLinkUrl": "",
                    Title: "",
                    "odata.editLink": "",
                    "odata.id": "",
                    "odata.metadata": "",
                    "odata.type": "SP.Web" as "SP.Web",
                };
                return expect(sp.web.stronglyTyped().expand("CurrentUser").select("Title").get().then(web => {
                    checkProps<typeof web>(expected);
                    checkProps<typeof expected>(web);
                    extend(expected, web, false, prop => hOP(expected, prop));
                    return web;
                })).to.eventually.deep.equal(expected);
            });
        });

        describe("expand with expanded prop select", () => {
            it("should get the base object with selected prop and untouched expanded props", function () {
                const expected = {
                    CurrentUser: {
                        Id: 0,
                        "odata.editLink": "",
                        "odata.id": "",
                        "odata.type": "SP.User" as "SP.User",
                    },
                    "CurrentUser@odata.navigationLinkUrl": "",
                    "odata.editLink": "",
                    "odata.id": "",
                    "odata.metadata": "",
                    "odata.type": "SP.Web" as "SP.Web",
                };
                return expect(sp.web.stronglyTyped().expand("CurrentUser").select("CurrentUser/Id").get().then(web => {
                    checkProps<typeof web>(expected);
                    checkProps<typeof expected>(web);
                    extend(expected, web, false, prop => hOP(expected, prop));
                    return web;
                })).to.eventually.deep.equal(expected);
            });
        });

        describe("backwards compatible", () => {
            it("should be backwards compatible", function () {
                return expect(sp.web.lists.select("Title").get()).to.eventually.fulfilled;
            });
        });
    }
});
