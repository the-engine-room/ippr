#!/bin/bash
if [ $TRAVIS_BRANCH == 'compiled-travis' ] ; then
	echo "Deploying to remote"
	eval `ssh-agent -s` #start shh agent
	ssh-add ~/.ssh/id_rsa
	cd _site
	git add .
	git commit -m "Deploy build #$TRAVIS_BUILD_NUMBER"
	git push deploy compiled-travis
else
	echo "Not deploying, since this branch isn't compiled-travis."
fi
