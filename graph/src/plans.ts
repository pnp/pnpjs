import { GraphQueryable, GraphQueryableInstance, GraphQueryableCollection } from "./graphqueryable";

export class Plans extends GraphQueryableCollection {

    constructor(baseUrl: string | GraphQueryable, path = "planner/plans") {
        super(baseUrl, path);
    }

    /**
     * Gets a plan from this collection by id
     * 
     * @param id Plan's id
     */
    public getById(id: string): Plan {
        return new Plan(this, id);
    }
}

export class Plan extends GraphQueryableInstance {


}
