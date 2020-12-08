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
        return this.childConfigHook(({ options, baseUrl, runtime }) => {
            return User(baseUrl, "me").configure(options).setRuntime(runtime);
        });
    },
});

Reflect.defineProperty(GraphRest.prototype, "users", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphRest) {
        return this.childConfigHook(({ options, baseUrl, runtime }) => {
            return Users(baseUrl).configure(options).setRuntime(runtime);
        });
    },
});
