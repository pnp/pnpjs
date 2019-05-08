import * as webpack from "webpack";
import * as server from "webpack-dev-server";
import config from "./webpack.config";

const serverSettings = {
    https: true,
    publicPath: "/assets/",
    stats: {
        colors: true,
    },
};

// Start a webpack-dev-server
new server(webpack(<any>config), serverSettings).listen(8080, "localhost", (err: Error | undefined) => {

    if (err) {
        throw err;
    }

    console.log("File will be served from: https://localhost:8080/assets/pnp.js");
});

