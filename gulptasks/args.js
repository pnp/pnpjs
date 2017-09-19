const yargs = require('yargs').argv;

/**
 * Updates the configuration file based on any command line args supplied
 * 
 * @param  inConfig The configuration file before changes are made
 */
const processConfigCmdLine = (inConfig) => {

    // update to only process specific packages
    if (yargs.packages) {

        let packages = yargs.packages.split(",").map(s => s.trim());

        if (!Array.isArray(packages)) {
            packages = [packages];
        }

        inConfig.packages = packages;
    }

    return inConfig;
}

module.exports = {
    processConfigCmdLine: processConfigCmdLine
};
