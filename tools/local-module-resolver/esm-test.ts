import { createResolve } from "./esm.js";

export const resolve = createResolve("/build/testing/packages");

// export async function getFormat(url: string, context, defaultGetFormat) {

//     // we force node to understand and load the executable mocha as a commonjs module
//     if (/bin\/mocha$/i.test(url)) {
//         return {
//             format: "commonjs",
//         };
//     }

//     // Defer to Node.js for all other URLs.
//     return defaultGetFormat(url, context, defaultGetFormat);
// }
