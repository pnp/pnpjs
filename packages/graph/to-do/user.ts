import { addProp } from "@pnp/queryable";
import { _User } from "../users/types.js";
import { ITodo, Todo } from "./types.js";

declare module "../users/types" {
    interface _User {
        todo: ITodo;
    }
    interface IUser {
        todo: ITodo;
    }
}

addProp(_User, "todo", Todo);
