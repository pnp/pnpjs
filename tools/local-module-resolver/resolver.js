"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
// based off the work in tsconfig-paths-webpack-plugin, thanks!
const path_1 = require("path");
const findup = require("findup-sync");
// give outselves a single reference to the projectRoot
const projectRoot = path_1.resolve(path_1.dirname(findup("package.json")));
/**
 * Installs a custom module load function that can resolve our build dir files
 * Returns a function to undo paths registration.
 */
function register(internalPath = "/build/testing/packages") {
    const Module = require("module");
    const originalResolveFilename = Module._resolveFilename;
    Module._resolveFilename = function (request, _parent) {
        if (request.startsWith("@pnp")) {
            const modifiedArguments = [path_1.join(projectRoot, internalPath, request.substring(4)), ...[].slice.call(arguments, 1)];
            return originalResolveFilename.apply(this, modifiedArguments);
        }
        return originalResolveFilename.apply(this, arguments);
    };
    return () => {
        // Return node's module loading to original state.
        Module._resolveFilename = originalResolveFilename;
    };
}
exports.register = register;
