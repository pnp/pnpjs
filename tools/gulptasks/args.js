const yargs = require('yargs').argv;

/**
 * Updates the configuration file based on any command line args supplied
 * 
 * @param  inConfig The configuration file before changes are made
 */
const processConfigCmdLine = (inConfig) => {

    // update to only process specific packages
    if (yargs.packages || yargs.p) {

        let packageNames = (yargs.packages || yargs.p).split(",").map(s => s.trim());

        if (!Array.isArray(packageNames)) {
            packageNames = [packageNames];
        }

        // lowercase our input
        packageNames = packageNames.map(name => name.toLowerCase());

        const processingPackages = [];

        for(let i = 0; i < packageNames.length; i++) {

            // see of we have any package entries and pass them along as-is
            const found = inConfig.packages.filter(p => {
                return ((typeof p === "string" && p === packageNames[i]) || (p.name === packageNames[i]));
            });

            [].push.apply(processingPackages, found);
        }

        inConfig.packages = processingPackages;
    }

    return inConfig;
}

module.exports = {
    processConfigCmdLine: processConfigCmdLine
};
