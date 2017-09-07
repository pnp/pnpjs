/**
 * Reads a blob as text
 *
 * @param blob The data to read
 */
export function readBlobAsText(blob: Blob): Promise<string> {
    return readBlobAs<string>(blob, "string");
}

/**
 * Reads a blob into an array buffer
 *
 * @param blob The data to read
 */
export function readBlobAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return readBlobAs<ArrayBuffer>(blob, "buffer");
}

/**
 * Generic method to read blob's content
 *
 * @param blob The data to read
 * @param mode The read mode
 */
function readBlobAs<T>(blob: Blob, mode: "string" | "buffer"): Promise<T> {

    return new Promise<T>((resolve, reject) => {

        try {

            const reader = new FileReader();
            reader.onload = (e: FileReaderEvent<T>) => {
                resolve(e.target.result);
            };

            switch (mode) {
                case "string":
                    reader.readAsText(blob);
                    break;
                case "buffer":
                    reader.readAsArrayBuffer(blob);
                    break;
            }
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Used to cast the event response target
 */
interface FileReaderEventTarget<T> extends EventTarget {
    result: T;
}

/**
 * Used to cast the event response
 */
interface FileReaderEvent<T> extends Event {
    target: FileReaderEventTarget<T>;
    getMessage(): string;
}
