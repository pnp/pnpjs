import { ILibraryConfiguration, DefaultRuntime } from "@pnp/common";
import { ISPConfigurationPart } from "@pnp/sp";
import { IGraphConfigurationPart } from "@pnp/graph";

export interface PnPConfiguration extends ILibraryConfiguration, ISPConfigurationPart, IGraphConfigurationPart { }

export function setup(config: PnPConfiguration): void {
    DefaultRuntime.assign(config);
}
