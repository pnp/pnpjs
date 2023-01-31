const child_process = require("child_process");
const path = require("path");

// give ourselves a single reference to the projectRoot
const projectRoot = path.resolve("./");

const isWin = process.platform === "win32";

// start up tsc on the serve tsconfig, which will execute in watch mode
child_process.spawn(isWin ? "npx.cmd" : "npx", ["tsc", "-p", "./packages/tsconfig-watch.json"], {
    cwd: projectRoot,
    stdio: "inherit",
});

// run our server
child_process.spawn(isWin ? "npx.cmd" : "npx", ["gulp", "serve", "--nobrowser"], {
    cwd: __dirname,
    stdio: "inherit",
});
