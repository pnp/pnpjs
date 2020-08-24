::
:: Publish script for PnPjs
::
@echo off
cls
echo.
echo Starting publish for PnPjs
cd ../..
echo Working directory: %cd%
echo.
echo.

::
:: merge version-2 branch into main
::
git checkout version-2
git pull
git checkout main
git pull
git merge version-2

::
:: ensure we have the latest deps
::
rmdir node_modules /S /Q 
call npm install

::
:: update the version
::
call npm version patch
git push

::
:: publish the packages
::
call npm run clean
call npm run package
call pnpbuild -n publish

::
:: update the documentation
::
mkdocs gh-deploy

::
:: merge main into version-2 branch
::
git checkout main
git pull
git checkout version-2
git pull
git merge main
git push

::
:: ensure we end up on the version-2 branch
::
git checkout version-2

echo All done :)
