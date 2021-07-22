# PatrIoT: a Private-by-Design Smart Home Platform

## Installation

To install all the required project dependencies run

```npm install```

Install also additional dependencies for Snowboy:

```sudo apt-get install libatlas-base-dev```

## Running 

```node main.js```

The web interface will be available at the following link:
`https://<hostname>:3000`

The flow graph of the running application will be available at:
`https://<hostname>:3000/graph`

## Notes

#### Compiling npm packages

Compiling npm packages within a SCONE container may sometimes fail. This is due to the fact that some of the packages use `child.process` Javascript method which spawns a separate process for packages' source code compliation. While this should usually work fine, it fails in SCONE container because SCONE currently (subject to change in future) does *NOT* allow spawning another process besides the main one currently running. This is done for security reasons. Any attempt to spawn additional child process will fail with ENOSYS error. This is briefly explained [here](https://sconedocs.github.io/Nodejs/).

In order to overcome this issue, we need a default Alpine Linux Docker image from the dockerhub to cross-compile the project's packages. After that we can just put a `node_modules` folder with the compiled packages into the SCONE's docker container. With this "hack" the PatrIoT prototype works fine within SCONE Docker container. 

To automate the things, I wrote a script that first fetches the latest PatrIoT version from the git repository, builds an Alpine Docker image with preinstalled packages needed for npm packages compilateion (python, g++, make), runs this image with the `npm rebuild` command, and, finally, builds the PatrIoT server image with the precompiled packages ready to be executed in SCONE.

The scripts in the `scripts/sgx/` project's folder are to be executed on SGX machine. 
First, you run `./setup.sh` script to prepare everything, and then you run `./run-patriot-container.sh` script to execute PatrIoT inside SCONE.

Note: 
- in order to pull SCONE:nodejs Docker image you need to be logged in with your Docker Hub account that was previously authorized by the SCONE maintainers. 
- SGX machine needs to have Docker and SGX SDK installed

#### Outdated Alpine Linux dependancy

SCONE curated Docker images is built on outdated Alpine Linux image (v 3.6). The latest version of Alpine Linux Docker image is v 3.9.

The latest Alpine Docker image has the newest node and npm packages versions, which compile packages differently as compared with previous versions. This is crucial, since failure to compile at least one package of the project leads to failure of the whole PatrIoT project.

One workaround is to use the previous version of Alpine Docker image for crosscompiling the npm packages. More specifically v 3.8. This version still works as intended. That's why from now on we need to specify the version of Alpine we want to pull from the Docker Hub for crosscompilation (Docker files were updated accordingly in `/script` folder of the project).


## Citing this work

``` 
@article{zavalyshyn2020patriot,
  title={My House, My Rules: A Private-by-Design Smart Home Platform},
  author={Zavalyshyn, Igor and Santos, Nuno and Sadre, Ramin and Legay, Axel},
  journal={EAI MobiQuitous},
  year={2020}
}
```
