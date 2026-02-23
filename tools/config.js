/**
 * To generate the configuration string to be pasted into the GitHub Action settings:
 * 
 *  PNPTESTING_MSAL_GRAPH_CONFIG
 *  PNPTESTING_MSAL_SP_CONFIG
 * 
 * When the cert expires, create a new cert, get the thumbprint and private key and paste them below,
 * ensure you keep the line break after the "-----END RSA PRIVATE KEY-----". As well update the app id and 
 * tenant id.
 * 
 * Run `node config.js`
 * 
 * Open the created "config.json" file and copy as a single line the contents into the settings listed above.
 * 
 * Do a merge to trigger the web tests and ensure there are no auth errors
 */

const fs = require("fs");

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
{replace this block with contents of key file}
-----END RSA PRIVATE KEY-----
`;

fs.writeFileSync("config.json", JSON.stringify({
    "auth": {
        "authority": "https://login.microsoftonline.com/{tenant id}/",
        "clientCertificate": {
            "thumbprint": "{thumb print}",
            "privateKey": privateKey,
        },
        "clientId": "{app id}"
    }
}));
