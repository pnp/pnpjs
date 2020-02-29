import { addProp } from "@pnp/odata";
import { _User } from "../users/types";
import { IInsights, Insights } from "./types";

declare module "../users/types" {
    interface _User {
        readonly insights: IInsights;
    }
    interface IUser {
        readonly insights: IInsights;
    }
}

addProp(_User, "insights", Insights);
