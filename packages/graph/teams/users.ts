import { addProp } from "@pnp/queryable";
import { _User } from "../users/types.js";
import { IInstalledApps, InstalledApps, ITeams, Teams } from "./types.js";

declare module "../users/types" {
    interface _User {
        readonly joinedTeams: ITeams;
        readonly installedApps: IInstalledApps;
    }
    interface IUser {
        readonly joinedTeams: ITeams;
        readonly installedApps: IInstalledApps;
    }
}

addProp(_User, "joinedTeams", Teams);
addProp(_User, "installedApps", InstalledApps, "teamwork/installedApps");
