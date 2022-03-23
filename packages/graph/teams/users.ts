import { addProp } from "@pnp/queryable";
import { _User } from "../users/types.js";
import { ITeams, Teams } from "./types.js";

declare module "../users/types" {
    interface _User {
        readonly joinedTeams: ITeams;
    }
    interface IUser {
        readonly joinedTeams: ITeams;
    }
}

addProp(_User, "joinedTeams", Teams);
