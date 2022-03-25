const fs = require("fs");
const path = require("path");

console.log("INFO: Updating project with PnP JS");

const crntDir = path.resolve(__dirname);

let nesting = crntDir.split("/");
if (nesting.length <= 1) nesting = crntDir.split("\\");

if (nesting.length > 0) {
  // Find the first node_modules folder index
  let idx = nesting.indexOf("node_modules");
  // Check if index of the folder was found
  if (idx !== -1) {
    // Slice unnecessary nodes
    const nest = nesting.slice(idx);
    if (nest && nest.length > 0) {
      const paths = nest.map((m) => "..");
      // Get the path of the projects root location
      const rootDir = path.resolve(path.join(mockDir, paths.join("/")));
      const packageJSON_fileLoc = `${rootDir}/package.json`;
      // Check if config.json file exists
      if (fs.existsSync(packageJSON_fileLoc)) {
        // Get the package.json file
        const packageJSON = fs.readFileSync(packageJSON_fileLoc, "utf8");
        const spfxVersion =
          JSON.parse(packageJSON).dependencies["@microsoft/sp-core-library"];
        const spfxVersionFloat = parseFloat(spfxVersion);
        if (spfxVersionFloat > 1.13) {
          fs.readdir(`${rootDir}/src/webparts`, function (err, webpartFolders) {
            if (err) {
              return console.log("Unable to scan directory: " + err);
            }
            webpartFolders.forEach(function (webpartFolder) {
              fs.readdir(
                `${rootDir}/src/webparts/${webpartFolder}`,
                function (err, files) {
                  if (err) {
                    return console.log("Unable to scan directory: " + err);
                  }
                  files.forEach((file) => {
                    if (file.endsWith(".ts")) {
                      const webpartTS_fileLoc = `${rootDir}/src/webparts/${webpartFolder}/${file}`;
                      const webpartTS = fs.readFileSync(
                        webpartTS_fileLoc,
                        "utf8"
                      );
                      const os = require("os");
                      const updated_webpartTS = webpartTS
                        .replace(
                          "protected onInit()",
                          "protected async onInit()"
                        )
                        .replace(
                          "return super.onInit();",
                          "await super.onInit();" +
                            os.EOL +
                            "\t\tconst sp = spfi().using(SPFx(this.context));"
                        );

                      const importStatement =
                        "import { spfi, SPFx } from '@pnp/sp';" + os.EOL;

                      if (webpartTS.indexOf(importStatement) === -1) {
                        fs.writeFileSync(
                          webpartTS_fileLoc,
                          importStatement + updated_webpartTS
                        );
                      } // importStatement _end_
                    }
                  });
                }
              );
            });
          });
          const ensureRush39 =
            JSON.parse(packageJSON).devDependencies[
              "@microsoft/rush-stack-compiler-3.9"
            ];

          if (ensureRush39 === "0.4.47") {
            const updated_packageJSON = packageJSON
              .replace(
                "@microsoft/rush-stack-compiler-3.9",
                "@microsoft/rush-stack-compiler-4.2"
              )
              .replace("0.4.47", "^0.1.2");

            console.log("Updating Rush stack compiler to 4.2 in package.json.");

            fs.writeFileSync(packageJSON_fileLoc, updated_packageJSON);

            const tsconfigJSON_fileLoc = `${rootDir}/tsconfig.json`;
            const tsconfigJSON = fs.readFileSync(tsconfigJSON_fileLoc, "utf8");
            const updated_tsconfigJSON = tsconfigJSON.replace(
              "rush-stack-compiler-3.9/includes/tsconfig-web.json",
              "rush-stack-compiler-4.2/includes/tsconfig-web.json"
            );
            fs.writeFileSync(tsconfigJSON_fileLoc, updated_tsconfigJSON);

            var os = require("os");
            const gulpString =
              "// ********* ADDED *******" +
              os.EOL +
              "// disable tslint" +
              os.EOL +
              "build.tslintCmd.enabled = false;" +
              os.EOL +
              "// ********* ADDED *******" +
              os.EOL +
              "build.initialize(require('gulp'));";
            const gulpfileJS_fileLoc = `${rootDir}/gulpfile.js`;
            const gulpfileJS = fs.readFileSync(gulpfileJS_fileLoc, "utf8");
            const updated_gulpfileJS = gulpfileJS.replace(
              "build.initialize(require('gulp'));",
              gulpString
            );
            fs.writeFileSync(gulpfileJS_fileLoc, updated_gulpfileJS);
          } else {
            const ensureRush42 =
              JSON.parse(packageJSON).devDependencies[
                "@microsoft/rush-stack-compiler-4.2"
              ];

            if (ensureRush42 === "^0.1.2") {
              console.warn(
                "WARNING: Rush stack compiler 4.2 already added to package.json."
              );
            }
          }
        }
      } else {
        console.warn("WARNING: the package.json file does not exist.");
      }
    } else {
      console.warn("WARNING: something is wrong with the installation path.");
    }
  } else {
    console.warn(
      "WARNING: something when wrong during with retrieving the project its root location."
    );
  }
} else {
  console.warn("WARNING: something is wrong with the installation path.");
}
