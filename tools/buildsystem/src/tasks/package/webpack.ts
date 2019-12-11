import * as wp from "webpack";

export function webpack(config: wp.Configuration): () => Promise<void> {

    return () => {

        return new Promise((res, reject) => {

            wp(config, (err, stats) => {

                if (err || stats.hasErrors()) {
                    console.error("Webpack exited with errors");
                    console.error(stats.toString());
                    reject(err);
                }

                if (stats.hasWarnings()) {
                    console.warn("Webpack exited with warnings");
                    console.warn(stats.toString());
                }

                res();
            });
        });
    };
}
