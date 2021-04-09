import { addProp } from "@pnp/queryable";
import { _User } from "../users/types.js";
import { IInsights, Insights } from "./types.js";

declare module "../users/types" {
    interface _User {
        readonly insights: IInsights;
    }
    interface IUser {
        readonly insights: IInsights;
    }
}

addProp(_User, "insights", Insights);
