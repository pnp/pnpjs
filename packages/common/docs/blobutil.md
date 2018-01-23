# @pnp/common/blobutil

The blobutil module contains helper functions for reading blobs either as text or as an array buffer.

## readBlobAsText

```TypeScript
import { readBlobAsText } from @pnp/common

// represents the blob to be read
const blob = new Blob();

readBlobAsText(blob).then(r => {

    // r will be a string of the blob's content
    console.log(r);
});
```

## readBlobAsArrayBuffer

```TypeScript
import { readBlobAsArrayBuffer } from @pnp/common

// represents the blob to be read
const blob = new Blob();

readBlobAsArrayBuffer(blob).then(r => {

    // r will be an ArrayBuffer of the blob's content
    console.log(r);
});
```