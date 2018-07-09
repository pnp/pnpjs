import { Logger } from "@pnp/logging";

export class SPBatchParseException extends Error {

    constructor(msg: string) {
        super(msg);
        this.name = "BatchParseException";
        Logger.error(this);
    }
}

export class MaxCommentLengthException extends Error {

    constructor(msg = "The maximum comment length is 1023 characters.") {
        super(msg);
        this.name = "MaxCommentLengthException";
        Logger.error(this);
    }
}

export class NotSupportedInBatchException extends Error {

    constructor(operation = "This operation") {
        super(`${operation} is not supported as part of a batch.`);
        this.name = "NotSupportedInBatchException";
        Logger.error(this);
    }
}

