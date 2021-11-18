#!/usr/bin/env sh
set -e
echo "Enter release version:"
read VERSION
read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Realeasing $VERSION ..."

  # commit
  if [[ -n $(git diff --stat)  ]]
  then
    git add -A
    git commit -m "build: $VERSION"
  fi
  npm version $VERSION --message "release: $VERSION"
  git push origin master --tags

  # publish
  npm publish
fi
