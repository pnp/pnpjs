import { GraphQueryable, GraphQueryableInstance } from "./graphqueryable";

export class Me extends GraphQueryableInstance {

    constructor(baseUrl: string | GraphQueryable, path = "me") {
        super(baseUrl, path);
    }
}
