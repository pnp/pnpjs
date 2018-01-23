# @pnp/odata/parsers

This modules contains a set of generic parsers. These can be used or extended as needed, though it is likely in most cases the
default parser will be all you need.

## ODataDefaultParser

The simplest parser used to transform a Response into its JSON representation.

## TextParser

Specialized parser used to parse the response usign the .text() method with no other processing. Used primarily for files.

## BlobParser

Specialized parser used to parse the response usign the .blob() method with no other processing. Used primarily for files.

## JSONParser

Specialized parser used to parse the response usign the .json() method with no other processing. Used primarily for files. 

## BufferFileParser

Specialized parser used to parse the response usign the .arrayBuffer() [node] for .buffer() [broswer] method with no other processing. Used primarily for files. 
