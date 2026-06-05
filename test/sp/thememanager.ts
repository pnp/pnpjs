import { expect } from "chai";
import { getRandomString } from "@pnp/core";
import "@pnp/sp/webs";
import "@pnp/sp/thememanager";
import { IThemePalette } from "@pnp/sp/thememanager";
import { pnpTest } from "../pnp-test.js";

describe("ThemeManager", function () {

    const createdThemeNames: string[] = [];

    // Sample theme palette for testing (hex string format)
    const testPalette: IThemePalette = {
        themePrimary: "#0078d4",
        themeLighterAlt: "#eff6fc",
        themeLighter: "#deecf9",
        themeLight: "#c7e0f4",
        themeTertiary: "#71afe5",
        themeSecondary: "#2b88d8",
        themeDarkAlt: "#106ebe",
        themeDark: "#005a9e",
        themeDarker: "#004578",
        neutralLighterAlt: "#faf9f8",
        neutralLighter: "#f3f2f1",
        neutralLight: "#edebe9",
        neutralQuaternaryAlt: "#e1dfdd",
        neutralQuaternary: "#d0d0d0",
        neutralTertiaryAlt: "#c8c6c4",
        neutralTertiary: "#a19f9d",
        neutralSecondary: "#605e5c",
        neutralPrimaryAlt: "#3b3a39",
        neutralPrimary: "#323130",
        neutralDark: "#201f1e",
        black: "#000000",
        white: "#ffffff",
    };

    after(async function () {
        // Clean up created themes
        for (const themeName of createdThemeNames) {
            try {
                await this.pnp.sp.themeManager.deleteTenantTheme(themeName);
            } catch (e) {
                // Ignore errors during cleanup
            }
        }
    });

    it("getTenantThemingOptions", pnpTest("f8a1b2c3-d4e5-6789-abcd-ef0123456789", async function () {
        const options = await this.pnp.sp.themeManager.getTenantThemingOptions();
        return expect(options).to.have.property("themePreviews");
    }));

    it("addTenantTheme", pnpTest("a1b2c3d4-e5f6-7890-abcd-ef1234567890", async function () {
        const { themeName } = await this.props({
            themeName: `TestTheme_${getRandomString(8)}`,
        });

        const result = await this.pnp.sp.themeManager.addTenantTheme(themeName, { palette: testPalette });
        createdThemeNames.push(themeName);

        return expect(result).to.be.true;
    }));

    it("updateTenantTheme", pnpTest("b2c3d4e5-f6a7-8901-bcde-f23456789012", async function () {
        const { themeName } = await this.props({
            themeName: `TestTheme_Update_${getRandomString(8)}`,
        });

        // First create a theme
        await this.pnp.sp.themeManager.addTenantTheme(themeName, { palette: testPalette });
        createdThemeNames.push(themeName);

        // Then update it with a modified palette
        const updatedPalette = { ...testPalette, themePrimary: "#107c10" };
        const result = await this.pnp.sp.themeManager.updateTenantTheme(themeName, { palette: updatedPalette });

        return expect(result).to.be.true;
    }));

    it("deleteTenantTheme", pnpTest("c3d4e5f6-a7b8-9012-cdef-345678901234", async function () {
        const { themeName } = await this.props({
            themeName: `TestTheme_Delete_${getRandomString(8)}`,
        });

        // Create a theme to delete
        await this.pnp.sp.themeManager.addTenantTheme(themeName, { palette: testPalette });

        // Delete it
        return expect(this.pnp.sp.themeManager.deleteTenantTheme(themeName)).to.eventually.be.fulfilled;
    }));

    it("applyTheme", pnpTest("d4e5f6a7-b8c9-0123-defa-456789012345", async function () {
        const { themeName } = await this.props({
            themeName: `TestTheme_Apply_${getRandomString(8)}`,
        });

        // Apply a theme to the current web
        return expect(this.pnp.sp.themeManager.applyTheme(themeName, { palette: testPalette })).to.eventually.be.fulfilled;
    }));
});
