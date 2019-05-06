# generator-package

This package is meant for use when creating a new package within the "packages" folder of the @pnp project. This will scaffold a project
to match what is expected from the build system as well as line up with the rest of the packages to keep things consistent.

### Use

```
// switch to this folder in the command line
$cd ./tools/generator-packgage

// install this as a generator globally
$npm install . -g

// create and switch to the package folder
$cd ./packages
$mkdir {package name}
$cd {package name}
$ yo package
```

### Notes

* This should never be published to npm
* This serves no purpose other than to help create consistent package structures
