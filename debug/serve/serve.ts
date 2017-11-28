import { sp } from "@pnp/sp";

sp.web.get().then(w => {

    alert("And I have changed! " + JSON.stringify(w.Title));
});
