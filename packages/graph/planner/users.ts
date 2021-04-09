import { addProp } from "@pnp/queryable";
import { _User } from "../users/types.js";
import { ITasks, Tasks } from "./types.js";

declare module "../users/types" {
    interface _User {
        readonly tasks: ITasks;
    }
    interface IUser {
        readonly tasks: ITasks;
    }
}

addProp(_User, "tasks", Tasks, "planner/tasks");
