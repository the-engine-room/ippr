#!/bin/bash

# Settings
img_ext="\.png$\|\.gif$\|.jpg$"
zopfli_ext="\.html$\|\.css$\|\.js$\|\.xml$"
gzip_ext="\.gz$"

# Global variable declaration
modfiles=""
modimg=""
modzopfli=""

# Functions
function init {
	echo "Initializing git"
	mkdir _site
	cd _site
	git init
	git remote add deploy "deploy@45.55.35.212:/var/www/html"
	git config user.name "Travis CI"
	git config user.email "mayarichman@gmail.com"
	echo "Fetching from remote"
	git fetch deploy
	git checkout -b build
	cd ..
}

function build {
	echo "Building..."
	grunt build # Build with Grunt; see Gruntfile.js for more details.
	echo "Committing the build"
	cd dist
	ls .
	cp -r * ../_site/
	cd ../_site
	ls .
	git add .
	git commit -q -m "Build #$TRAVIS_BUILD_NUMBER"
	cd ..
}

function compare {
	echo "Comparing this build to the previous one"
	cd _site
	git checkout master

	modfiles=$(git diff --name-only master..build | grep -v $gzip_ext)
	modimg=$(grep $img_ext <<< "$modfiles" | tr '\n' ' ') # Not used right now, but this is a TODO.
	modzopfli=$(grep $zopfli_ext <<< "$modfiles" | tr '\n' ' ')
	modfiles=$(echo $modfiles | tr '\n' ' ')

	git merge -X theirs --commit -m "Merge build #$TRAVIS_BUILD_NUMBER" build
	cd ..
}

init
build
#compare

# Compress assets with Zopfli (should always be the last command)
echo "Compressing the following assets using Zopfli: $modfiles"
cd _site
../zopfli/zopfli --i1000 $modzopfli
cd ..
