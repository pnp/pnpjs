import { defaultPath } from "../decorators.js";
import { GraphFI } from "../fi.js";
import { _GraphQueryable, graphInvokableFactory } from "../graphqueryable.js";
import { IPeopleAdmin, PeopleAdmin } from "./people.js";
import { IServiceAccouncements, ServiceAnnouncements} from "./serviceAnnouncements.js";
import { SharePointAdmin, ISharePointAdmin } from "./sharepoint.js";

declare module "../fi" {
    interface GraphFI {
        readonly admin: IAdmin;
    }
}

defaultPath("admin");
class _Admin extends _GraphQueryable<IAdmin> {
    public get people(){
        return PeopleAdmin(this);
    }
    public get sharepoint() {
        return SharePointAdmin(this);
    }
    public get serviceAnnouncements() {
        return ServiceAnnouncements(this);
    }
}

export interface IAdmin {
    readonly people: IPeopleAdmin;
    readonly sharepoint: ISharePointAdmin;
    readonly serviceAnnouncements: IServiceAccouncements;
}

export const Admin: IAdmin = <any>graphInvokableFactory(_Admin);


Reflect.defineProperty(GraphFI.prototype, "admin", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(<any>Admin, "admin");
    },
});
