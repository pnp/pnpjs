import { LibraryConfiguration, RuntimeConfig } from "@pnp/common";
import { SPConfigurationPart } from "@pnp/sp";
import { GraphConfigurationPart } from "@pnp/graph";

export interface PnPConfiguration extends LibraryConfiguration, SPConfigurationPart, GraphConfigurationPart { }

export function setup(config: PnPConfiguration): void {
    RuntimeConfig.extend(config);
}
