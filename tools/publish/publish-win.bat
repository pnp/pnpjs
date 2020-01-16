::
:: Publish script for PnPjs
::
@echo off
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
get merge version-2

::
:: ensure we have the latest deps
::
npm ci

::
:: update the version
::
npm version patch
git push

::
:: publish the packages
::
npm run clean
npm run package
pnpbuild -n publish

::
:: update the documentation
::
mkdocs --gh-deploy

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
