#!/bin/sh

# remove patriot folder if exists
sudo rm -rf patriot

# get the source code from Github (lambda-state branch)
git clone --branch lambda-state git@github.com:zavalyshyn/patriot.git

# create TLS certificate and key
cd patriot/scripts/
./genkeyncert.sh
cd ../..

# Add correct MLODService.js file
# sudo cp MLODService.js patriot/modules/services/MLODService.js

# Copy package.json file and remove package-lock.json
# sudo cp package.json patriot/
# sudo rm patriot/package-lock.json

# [ONLY FOR HUB] Copy HubRouterService.js file
# sudo cp HubRouterService.js patriot/modules/services/

# remove previous Docker images
sudo docker rmi alpine-npm-crosscompiler patriot-server

# build Alpine Docker image for crosscompilation
sudo docker build -t alpine-npm-crosscompiler -f AlpineDockerfile .

# crosscompile npm packages using alpine-npm-crosscompiler image
sudo docker run -it --rm -v ${PWD}/patriot:/patriot:rw alpine-npm-crosscompiler

# Copy fixed index.js and mobilenet.js files
# sudo cp index.js mobilenet.js patriot/node_modules/@tensorflow-models/mobilenet/dist/

# copy keys folder to the patriot folder
cp /home/igor/patriot-scone/keys/philips-hue-username /home/igor/patriot-scone/patriot/keys
cp /home/igor/patriot-scone/keys/pushBulletAPIToken /home/igor/patriot-scone/patriot/keys

# build a PatrIoT Docker image
sudo docker build -t patriot-server -f PatriotDockerfile .
