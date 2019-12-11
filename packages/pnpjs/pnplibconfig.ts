import { LibraryConfiguration, RuntimeConfig } from "@pnp/common";
import { SPConfigurationPart } from "@pnp/sp";

export interface PnPConfiguration extends LibraryConfiguration, SPConfigurationPart { }

export function setup(config: PnPConfiguration): void {
    RuntimeConfig.assign(config);
}
