# Explain Selective Imports concept

- custom bundles section

- gotcha of importing only interfaces will appear to work but that import is removed during transpile because yhere is no ref. you need to use the independent import (import "@pnp/sp/src/blah").