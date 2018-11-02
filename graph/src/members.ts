import { GraphQueryableInstance, GraphQueryableCollection, defaultPath } from "./graphqueryable";
import { jsS } from "@pnp/common";

@defaultPath("members")
export class Members extends GraphQueryableCollection {

    /**
     * Use this API to add a member to an Office 365 group, a security group or a mail-enabled security group through
     * the members navigation property. You can add users or other groups.
     * Important: You can add only users to Office 365 groups.
     * 
     * @param id Full @odata.id of the directoryObject, user, or group object you want to add (ex: https://graph.microsoft.com/v1.0/directoryObjects/${id})
     */
    public add(id: string): Promise<any> {

        return this.clone(Members, "$ref").postCore({
            body: jsS({
                "@odata.id": id,
            }),
        });
    }

    /**
     * Gets a member of the group by id
     * 
     * @param id Group member's id
     */
    public getById(id: string): Member {
        return new Member(this, id);
    }
}

export class Member extends GraphQueryableInstance { }

@defaultPath("owners")
export class Owners extends Members { }
