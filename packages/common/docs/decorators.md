# @pnp/common/decorators

This module contains decorators use internally within the @pnp libraries. You are welcome to use them in your projects.

## deprecated

Used to tag methods, properties, or classes that are deprecated and will be removed in future versions. By policy we maintain a feature for at least one release
after tagging it and before removing it. It takes a single argument that indicates the target version for removal.

## beta

Used to tag methods, properties, or classes that are in beta and subject to change. This is generally used when the underlying REST endpoint is tagged as beta to
let folks know a given piece of functionality is subject to change.