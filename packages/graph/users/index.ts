import { GraphRest } from "../rest.js";
import { IUser, User, IUsers, Users } from "./types.js";

export {
    IUser,
    IUsers,
    User,
    Users,
    IPeople,
    People,
} from "./types.js";

declare module "../rest" {
    interface GraphRest {
        readonly me: IUser;
        readonly users: IUsers;
    }
}

Reflect.defineProperty(GraphRest.prototype, "me", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphRest) {
        return this.create(User, "me");
    },
});

Reflect.defineProperty(GraphRest.prototype, "users", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphRest) {
        return this.create(Users);
    },
});
