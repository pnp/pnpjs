import { GraphQueryable, GraphQueryableInstance, GraphQueryableCollection } from "./graphqueryable";

/**
 * Describes a collection of Users objects
 *
 */
export class Users extends GraphQueryableCollection {

    constructor(baseUrl: string | GraphQueryable, path = "users") {
        super(baseUrl, path);
    }

    /**
     * Gets a user from the collection using the specified id
     * 
     * @param id Id of the user to get from this collection
     */
    public getById(id: string): User {
        return new User(this, id);
    }
}

/**
 * Represents a user entity
 */
export class User extends GraphQueryableInstance {}
