import {
    GraphQueryable,
    GraphQueryableInstance,
} from "@pnp/graph";

export class Team extends GraphQueryableInstance {

    constructor(baseUrl: string | GraphQueryable, path?: string) {
        super(baseUrl, path);
    }

    // need a per-method way to switch to beta endpoint?


}
