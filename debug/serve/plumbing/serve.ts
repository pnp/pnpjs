import webpack from "webpack";
import devserver from "webpack-dev-server";
import config from "./webpack.config.js";

const serverSettings = {
    server: {
        type: "https",
    },
};

// Start a webpack-dev-server
const server = new devserver(serverSettings, webpack(<any>config));

const runServer = async () => {
    console.log("File will be served from: https://localhost:8080/assets/pnp.js");
    await server.start();
};

runServer();
