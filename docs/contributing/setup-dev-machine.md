# Setting up your Developer Machine

If you are a longtime client side developer you likely have your machine already configured and can skip to [forking the repo](#fork-the-repo) and [debugging](./debugging.md).

## Setup your development environment

These steps will help you get your environment setup for contributing to the core library.

1. Install [Visual Studio Code](https://code.visualstudio.com/) - this is the development environment we use so the contribution sections expect you are as well. If you prefer you can use Visual Studio or any editor you like.

1. Install [Node JS](https://nodejs.org/en/download/) - this provides two key capabilities; the first is the nodejs server which will act as our development server (think iisexpress), the second is npm a package manager (think nuget).

    > This library requires node >= 10.18.0

1. On Windows: Install [Python](https://www.python.org/downloads)

1. [Optional] Install the tslint extension in VS Code:

    1. Press Shift + Ctrl + "p" to open the command panel
    2. Begin typing "install extension" and select the command when it appears in view
    3. Begin typing "tslint" and select the package when it appears in view
    4. Restart Code after installation

## Fork The Repo

All of our contributions come via [pull requests](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) and you'll need to fork the repository

1. Now we need to fork and clone the git repository. This can be done using your [console](https://help.github.com/articles/fork-a-repo/) or using your preferred Git GUI tool.

1. Once you have the code locally, navigate to the root of the project in your console. Type the following command:

     `npm install`

1. Follow the [guidance to complete the one-time local configuration](./local-debug-configuration.md) required to debug and run tests.

1. Then you can follow the guidance in the [debugging](./debugging.md) article.
