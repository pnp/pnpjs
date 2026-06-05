import { SPFI } from "../fi.js";
import { IThemeManager, ThemeManager } from "./types.js";

export {
    IThemeManager,
    ThemeManager,
    IRGBAColor,
    ThemeColor,
    IThemePalette,
    IThemeColorPair,
    IThemeJson,
    IThemeInfo,
    ITenantThemingOptions,
} from "./types.js";

declare module "../fi" {
    interface SPFI {
        readonly themeManager: IThemeManager;
    }
}

Reflect.defineProperty(SPFI.prototype, "themeManager", {
    configurable: true,
    enumerable: true,
    get: function (this: SPFI) {
        return this.create(ThemeManager);
    },
});
