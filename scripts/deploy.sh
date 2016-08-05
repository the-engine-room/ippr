#!/bin/bash

if [ $TRAVIS_BRANCH == 'master' ] ; then
	echo "Deploying to remote"
	cd _site
  git status
  git branch
  git push -f deploy master
else
	echo "Not deploying, since this branch isn't master."
fi
