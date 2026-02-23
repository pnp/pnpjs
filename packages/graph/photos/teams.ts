import { addProp } from "@pnp/queryable";
import { _Team } from "../teams/types.js";
import { Photo, IPhoto } from "./types.js";

declare module "../teams/types" {
    interface _Team {
        readonly photo: IPhoto;
    }
    interface ITeam {
        readonly photo: IPhoto;
    }
}

addProp(_Team, "photo", Photo);
