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
:: merge version-2 branch into master
::
git checkout version-2
git pull
git checkout master
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
:: merge master into version-2 branch
::
git checkout master
git pull
git checkout version-2
git pull
get merge master
git push

::
:: ensure we end up on the version-2 branch
::
git checkout version-2

echo "All done :)"
