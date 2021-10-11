import { GraphFI } from "../fi.js";
import { IUser, User, IUsers, Users } from "./types.js";

export {
    IUser,
    IUsers,
    User,
    Users,
    IPeople,
    People,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly me: IUser;
        readonly users: IUsers;
    }
}

Reflect.defineProperty(GraphFI.prototype, "me", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(User, "me");
    },
});

Reflect.defineProperty(GraphFI.prototype, "users", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(Users);
    },
});
