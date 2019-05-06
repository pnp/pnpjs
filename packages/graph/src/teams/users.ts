import { addProp } from "@pnp/odata";
import { _User } from "../users/types";
import { ITeams, Teams } from "./types";

declare module "../users/types" {
    interface _User {
        readonly joinedTeams: ITeams;
    }
    interface IUser {
        readonly joinedTeams: ITeams;
    }
}

addProp(_User, "joinedTeams", Teams, "joinedTeams");
