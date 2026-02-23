import { addProp, body } from "@pnp/queryable";
import { graphPost } from "../graphqueryable.js";
import { Permission as IPermissionType } from "@microsoft/microsoft-graph-types";
import { _Site } from "../sites/types.js";
import { IPermissions, Permissions, _Permissions } from "./types.js";

declare module "../sites/types" {
    interface _Site {
        readonly permissions: IPermissions;
        add(permissions: Pick<IPermissionType, "roles" | "grantedToIdentities" | "expirationDateTime">): Promise<IPermissionType>;
    }
    interface ISite {
        readonly permissions: IPermissions;
        add(permissions: Pick<IPermissionType, "roles" | "grantedToIdentities" | "expirationDateTime">): Promise<IPermissionType>;
    }
}

addProp(_Site, "permissions", Permissions);

declare module "./types" {
    interface _Permissions {
        add(permissions: Pick<IPermissionType, "roles" | "grantedToIdentities" | "expirationDateTime">): Promise<IPermissionType>;
    }
    interface IPermissions {
        add(permissions: Pick<IPermissionType, "roles" | "grantedToIdentities" | "expirationDateTime">): Promise<IPermissionType>;
    }
}

_Permissions.prototype.add = async function addPermissions(permissions: Pick<IPermissionType, "roles" | "grantedToIdentities" | "expirationDateTime">): Promise<IPermissionType> {
    return graphPost(this, body(permissions));
};

