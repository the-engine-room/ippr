#!/bin/bash

echo "Importing the SSH deployment key"
# Import the SSH deployment key
openssl aes-256-cbc -K $encrypted_22009518e18d_key -iv $encrypted_22009518e18d_iv -in deploy-key.enc -out deploy-key -d
rm deploy-key.enc # Don't need it anymore
chmod 600 deploy-key
mv deploy-key ~/.ssh/id_rsa

echo "Installing zopfli"
git clone https://github.com/google/zopfli.git
cd zopfli
make
chmod +x zopfli
cd ..

echo "Installing npm dependencies"
npm install
