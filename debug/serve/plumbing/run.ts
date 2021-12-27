import { spawn } from "child_process";
import { dirname, resolve } from "path";
import findup from "findup-sync";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// give outselves a single reference to the projectRoot
const projectRoot = resolve(dirname(findup("package.json")));

const isWin = process.platform === "win32";

// start up tsc on the serve tsconfig, which will execute in watch mode
const npx = spawn(isWin ? "npx.cmd" : "npx", ["tsc", "-p", "./debug/serve/tsconfig.json", "--watch"], {
    cwd: projectRoot,
});

npx.stdout.on("data", (data) => {
    console.log(`NPX: ${data}`);
});

// run our server
spawn("node", ["./serve.js"], {
    cwd: __dirname,
    stdio: "inherit",
});
