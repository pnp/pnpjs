import { _File } from "../files/types";
import { WebPartsPersonalizationScope, ILimitedWebPartManager, LimitedWebPartManager } from "./types";

declare module "../files/types" {
    interface _File {
        getLimitedWebPartManager(scope?: WebPartsPersonalizationScope): ILimitedWebPartManager;
    }
    interface IFile {
        /**
         * Specifies the control set used to access, modify, or add Web Parts associated with this Web Part Page and view.
         * An exception is thrown if the file is not an ASPX page.
         *
         * @param scope The WebPartsPersonalizationScope view on the Web Parts page.
         */
        getLimitedWebPartManager(scope?: WebPartsPersonalizationScope): ILimitedWebPartManager;
    }
}

_File.prototype.getLimitedWebPartManager = function (this: _File, scope = WebPartsPersonalizationScope.Shared): ILimitedWebPartManager {
    return LimitedWebPartManager(this, `getLimitedWebPartManager(scope=${scope})`);
};
