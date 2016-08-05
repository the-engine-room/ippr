#!/bin/bash
if [ $TRAVIS_BRANCH == 'master' ] ; then
	echo "Deploying to remote"
  pwd
  cd _site
#	git add -A
#	git commit -m "Deploy build #$TRAVIS_BUILD_NUMBER"
	git push deploy master
else
	echo "Not deploying, since this branch isn't master."
fi

#eval `ssh-agent -s` #start shh agent
#ssh-add ~/.ssh/id_rsa

# set -x

# if [ "$TRAVIS_BRANCH" = "master" ] ; then
#   cd _site
# #  git init
#   pwd
#   git remote add deploy "deploy@45.55.35.212:/var/www/html/.git"
#
#   # verify remote
#   git remote -v
#
#   git config --global user.name "Travis CI"
#   git config --global user.email "mayarichman@gmail.com"
#   cd ..
#   ls -la
#   git add -A
#   git status
#   git remote show origin
#   git commit -m "Deploy"
#   git push --force deploy master
# else
#   echo "Not deploying, since this branch isn't master."
# fi
