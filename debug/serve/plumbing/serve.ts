import webpack from "webpack";
import devserver from "webpack-dev-server";
import config from "./webpack.config.js";
import { resolve, dirname } from "path";
import findupSync from "findup-sync";

const projectRoot = resolve(dirname(findupSync("package.json")));

const serverSettings = {
    server: {
        type: "https",
    },
    static: {
        directory: resolve(projectRoot, "debug/serve"),
    },
};

// Start a webpack-dev-server
const server = new devserver(serverSettings, webpack(<any>config));

const runServer = async () => {
    console.log("File will be served from: https://localhost:8080/assets/pnp.js");
    console.log("SPA Page will be served from: https://localhost:8080/spa.html");
    await server.start();
};

runServer();
