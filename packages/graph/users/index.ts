import { GraphRest } from "../rest";
import { IUser, User, IUsers, Users } from "./types";

export {
    IUser,
    IUsers,
    User,
    Users,
    IPeople,
    People,
} from "./types";

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
        return User(this, "me");
    },
});

Reflect.defineProperty(GraphRest.prototype, "users", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphRest) {
        return Users(this);
    },
});
