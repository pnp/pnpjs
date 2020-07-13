# Building the Documentation

Building the documentation locally can help you visualize change you are making to the docs. What you see locally should be what you see online.

## Building

Documentation is built using MkDocs. You will need to latest version of Python (tested on version 3.7.1) and pip. If you're on the Windows operating system, make sure you have added Python to your [Path environment variable](https://docs.python.org/3/using/windows.html).

When executing the pip module on Windows you can prefix it with **python -m**.
For example:

`python -m pip install mkdocs-material`

We also need to install the mermaid2 plugin, used to generate flowcharts within the docs.

`pip install mkdocs-mermaid2-plugin`

- [Install MkDocs](https://www.mkdocs.org/#installation)
  - pip install mkdocs
- Install the Material theme
  - pip install mkdocs-material
- install the mkdocs-markdownextradata-plugin - this is used for the version variable
  - pip install mkdocs-markdownextradata-plugin (doesn't work on Python v2.7)
- install redirect plugin - used to redirect from moved pages
  - pip install mkdocs-redirects
- Serve it up
  - mkdocs serve
  - Open a browser to `http://127.0.0.1:8000/`



-------
Not needed but maybe used later:
- install the mermaid2 plugin - used to render charts
  - pip install mkdocs-mermaid2-plugin
