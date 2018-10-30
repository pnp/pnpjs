# Building the Documentation

Building the documentation locally can help you visualize change you are making to the docs. What you see locally should be what you see online.

## Building
Documentation is built using MkDocs. You will need to latest version of Python (tested on version 3.7.1) and pip. If you're on the Windows operating system, make sure you have added Python to your [Path environment variable](https://docs.python.org/3/using/windows.html).

When executing the pip module on Windows you can prefix it with **python -m**. 
For example: 
```
python -m pip install mkdocs-material
```

- [Install MkDocs](https://www.mkdocs.org/#installation)
    - pip install mkdocs
- Install the Material theme
    - pip install mkdocs-material
- install the mkdocs-markdownextradata-plugin - this is used for the version variable
    - pip install mkdocs-markdownextradata-plugin (doesn't work on Python v2.7)
- Serve it up
    - mkdocs serve
    - Open a browser to http://127.0.0.1:8000/
