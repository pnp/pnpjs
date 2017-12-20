# @pnp/odata/odatabatch

This module contains an abstract class used as a base when inheriting libraries support batching.

## ODataBatchRequestInfo

This interface defines what each batch needs to know about each request. It is generic in that any library can provide the information but will
be responsible for processing that info by implementing the abstract executeImpl method.

## ODataBatch

Base class for building batching support for a library inheriting from @pnp/odata. You can see implementations of this abstract class in the @pnp/sp
and @pnp/graph modules.
