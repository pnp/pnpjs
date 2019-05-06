import { addProp } from "@pnp/odata";
import { _User } from "../users/types";
import { ITasks, Tasks } from "./types";

declare module "../users/types" {
    interface _User {
        readonly tasks: ITasks;
    }
    interface IUser {
        readonly tasks: ITasks;
    }
}

addProp(_User, "tasks", Tasks, "planner/tasks");
