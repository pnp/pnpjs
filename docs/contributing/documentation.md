# Documentation

Just like with tests we have invested much time in updating the documentation and when you make a change to the library you should update the associated documentation as part of the pull request.

## Writing Docs

Our docs are all written in markdown and processed using MkDocs. You can use code blocks, tables, and other markdown formatting. You can review the other articles for examples on writing docs. Generally articles should focus on how to use the library and where appropriate link to official outside documents as needed. Official documentation could be Microsoft, other library project docs such as MkDocs, or other sources.

## Building Docs Locally

Building the documentation locally can help you visualize change you are making to the docs. What you see locally will be what you see online. Documentation is built using MkDocs. You will need to latest version of Python (tested on version 3.7.1) and pip. If you're on the Windows operating system, make sure you have added Python to your [Path environment variable](https://docs.python.org/3/using/windows.html).

When executing the pip module on Windows you can prefix it with **python -m**.
For example:

`python -m pip install mkdocs-material`

- [Install MkDocs](https://www.mkdocs.org/#installation)
    - pip install mkdocs
- Install the Material theme
    - pip install mkdocs-material
- install the mkdocs-markdownextradata-plugin - this is used for the version variable
    - pip install mkdocs-markdownextradata-plugin (doesn't work on Python v2.7)
- install redirect plugin - used to redirect from moved pages
    - pip install mkdocs-redirects
- Serve it up
    - `mkdocs serve`
    - Open a browser to `http://127.0.0.1:8000/`

> Please see the [official mkdocs site](https://www.mkdocs.org/) for more details on working with mkdocs

## Next Steps

After your changes are made, you've added/updated tests, and updated the docs you're ready to [submit a pull request](./pull-requests.md)!
