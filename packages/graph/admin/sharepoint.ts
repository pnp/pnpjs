import { graphInvokableFactory, _GraphInstance } from "../graphqueryable.js";
import { defaultPath, updateable, IUpdateable } from "../decorators.js";
import { SharepointSettings as ISharePointSettingsType } from "@microsoft/microsoft-graph-types";

@defaultPath("sharepoint")
export class _SharePointAdmin extends _GraphInstance<ISharePointAdmin> {
    public get settings(): ISharePointSettings {
        return SharePointSettings(this);
    }
}

export interface ISharePointAdmin extends _SharePointAdmin {
    readonly settings: ISharePointSettings;
}
export const SharePointAdmin = graphInvokableFactory<ISharePointAdmin>(_SharePointAdmin);

/**
 * SharePoint Tenant Settings
 */
@defaultPath("settings")
@updateable()
export class _SharePointSettings extends _GraphInstance<ISharePointSettingsType> { }
export interface ISharePointSettings extends _SharePointSettings, IUpdateable<ISharePointSettingsType> { }
export const SharePointSettings = graphInvokableFactory<ISharePointSettings>(_SharePointSettings);
