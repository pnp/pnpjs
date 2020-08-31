import { ILibraryConfiguration, RuntimeConfig } from "@pnp/common";
import { ISPConfigurationPart } from "@pnp/sp";

export interface PnPConfiguration extends ILibraryConfiguration, ISPConfigurationPart { }

export function setup(config: PnPConfiguration): void {
    RuntimeConfig.assign(config);
}
