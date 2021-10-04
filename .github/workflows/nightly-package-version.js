const fs = require('fs');
const path = require('path');
const packageJson = require('../../package.json');
const date = new Date();
packageJson.version += `-v3nightly.${date.getFullYear()}${date.getMonth()}${date.getDay()}`;
console.log(packageJson.version);
fs.writeFileSync(path.join(path.resolve('.'), 'package.json'), JSON.stringify(packageJson, null, 2));
