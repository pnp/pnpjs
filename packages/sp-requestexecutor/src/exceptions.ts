export class SPRequestExecutorUndefinedException extends Error {

    constructor() {
        const msg = [
            "SP.RequestExecutor is undefined. ",
            "Load the SP.RequestExecutor.js library (/_layouts/15/SP.RequestExecutor.js) before loading the PnP JS Core library.",
        ].join(" ");
        super(msg);
        this.name = "SPRequestExecutorUndefinedException";
        defaultLog(this);
    }
}
