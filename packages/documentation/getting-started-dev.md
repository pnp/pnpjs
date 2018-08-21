# Contribution Guide

Thank you for your interest in contributing to our work. This guide should help you get started, please let us know if you have any questions.

## Contributor Guidance

* Target your pull requests to the **dev** branch
* Add/Update any relevant docs articles in the relevant package's docs folder related to your changes
* Include a test for any new functionality and ensure all existing tests are passing by running `gulp test`
* Ensure tslint checks pass by typing `gulp lint`
* Keep your PRs as simple as possible and describe the changes to help the reviewer understand your work
* If you have an idea for a larger change to the library please [open an issue](https://github.com/pnp/pnpjs/issues) and let's discuss before you invest many hours - these are very welcome but want to ensure it is something we can merge before you spend the time :)

## Setup your development environment

These steps will help you get your environment setup for contributing to the core library.

1. Install [Visual Studio Code](https://code.visualstudio.com/) - this is the development environment we will use. It is similar to a light-weight Visual Studio designed for each editing of client file types such as .ts and .js. (Note that if you prefer you can use Visual Studio).

2. Install [Node JS](https://nodejs.org/en/download/) - this provides two key capabilities; the first is the nodejs server which will act as our development server (think iisexpress), the second is npm a package manager (think nuget).

3. On Windows: Install [Python v2.7.10](https://www.python.org/downloads/release/python-2710/) - this is used by some of the plug-ins and build tools inside Node JS - (Python v3.x.x is not supported by those modules). If Visual Studio is not installed on the client in addition to this C++ runtime is required. Please see [node-gyp Readme](https://github.com/nodejs/node-gyp/blob/master/README.md)

4. Install a console emulator of your choice, for Windows [Cmder](http://cmder.net/) is popular. If installing Cmder choosing the full option will allow you to use git for windows. Whatever option you choose we will refer in the rest of the guide to "console" as the thing you installed in this step.

5. Install the tslint extension in VS Code:
	1. Press Shift + Ctrl + "p" to open the command panel
	2. Begin typing "install extension" and select the command when it appears in view
	3. Begin typing "tslint" and select the package when it appears in view
	4. Restart Code after installation

6. Install the gulp command line globally by typing the following code in your console `npm install -g gulp-cli`

7. Now we need to fork and clone the git repository. This can be done using your [console](https://help.github.com/articles/fork-a-repo/) or using your preferred Git GUI tool.

8. Once you have the code locally, navigate to the root of the project in your console. Type the following command:
  - `npm install` - installs all of the npm package dependencies (may take awhile the first time)

9. Copy settings.example.js in the root of your project to settings.js. Edit settings.js to reflect your personal environment (usename, password, siteUrl, etc.).

10. Then you can follow the guidance in the [debugging](debugging.md) article to get started testing right away!

