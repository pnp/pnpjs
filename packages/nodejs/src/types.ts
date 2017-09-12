/**
 * these are used to define interfaces contained in other libraries
 * We could add an import creating a dependency but the number is small and it doesn't
 * seem right to create a dependency on @pnp/sp just for an interface
 */

import { FetchOptions } from "@pnp/common";

export interface HttpClientImpl {
    fetch(url: string, options: FetchOptions): Promise<Response>;
}
