#!/bin/sh

rm -rf .cursor/rules/global-00-general.mdc
rm -rf .cursor/rules/global-01-backend.mdc
rm -rf .cursor/rules/global-02-commit.mdc

ln -s /Users/lincenying/OneDrive/Setting/cusor/Elysia/global-00-general.mdc .cursor/rules/global-00-general.mdc
ln -s /Users/lincenying/OneDrive/Setting/cusor/Elysia/global-01-backend.mdc .cursor/rules/global-01-backend.mdc
ln -s /Users/lincenying/OneDrive/Setting/cusor/Elysia/global-02-commit.mdc .cursor/rules/global-02-commit.mdc

grep -qxF '.cursor/rules/global*.mdc' .gitignore 2>/dev/null || echo '.cursor/rules/global*.mdc' >> .gitignore
