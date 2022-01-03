// based off the work in tsconfig-paths-webpack-plugin, thanks!
import { resolve, dirname, join } from "path";
import findup from "findup-sync";
import { Module } from "module";

// give ourselves a single reference to the projectRoot
const projectRoot = resolve(dirname(findup("package.json")));

/**
* Installs a custom module load function that can resolve our build dir files
* Returns a function to undo paths registration.
*/
export function register(internalPath: string): () => void {

  const originalResolveFilename = (<any>Module)._resolveFilename;
  (<any>Module)._resolveFilename = function (request: string, _parent: any): string {

    if (request.startsWith("@pnp")) {

      const modifiedArguments = [join(projectRoot, internalPath, request.substring(4)), ...[].slice.call(arguments, 1)];
      return originalResolveFilename.apply(this, modifiedArguments);
    }

    return originalResolveFilename.apply(this, arguments);
  };

  return () => {
    // Return node's module loading to original state.
    (<any>Module)._resolveFilename = originalResolveFilename;
  };
}

register("/build/testing/packages");
