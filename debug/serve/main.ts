import { sp } from "@pnp/sp";

// ******
// Please edit this file and do any testing required. Please do not submit changes as part of a PR.
// ******

sp.web.get().then(w => {

    alert(JSON.stringify(w.Title));
});
