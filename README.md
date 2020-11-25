# PatrIoT project

## Installation

To install all the required project dependencies run

```npm install```

Install also additional dependencies for Snowboy:

```sudo apt-get install libatlas-base-dev```

## Running 

```node main.js```

**[NOT AVAILABLE YET]** The web interface will be available at the following link:
`https://<hostname>:3000`

**[NOT AVAILABLE YET]** The flow graph of the running application will be available at:
`https://<hostname>:3000/graph`

## Tasks

1. ~~Add graph visualization part of PatrIoT. Should show the layout elements and datatypes passed.~~ DONE
2. Add model checking code to verify the prolog rules and data flows.
3. Port PatrIoT code to the Router side. 
4. Private variables. In Java implementation there are some variables that must be private, since they carry a sensitive type of data and must be protected. In JS there are no private variables by default.    
 
   One way to implement those is to use functions as classes. The variables declared inside the function remain available *only* within that function. Any attempt to access those from outside the function will fail. This is good, but if we need to extend those function "classes" later on, these "private" variables are not inherited by the child classes. And in several cases we do need the private variables to be inherited by child classes (in Java implementation those we marked as protected variables). We could potentially fix this issue by declaring these variables in the child classes directly and in this case the variables inheritance is not really needed.  

## Current challenges

1) **[SHOULD BE CHANGED COMPLETELY]** Right now, the event dispatcher & generator are implemented using setTimeout or setInterval which is fine but not really efficient. Since Javascript is synchronous and single-threaded, what we actually do with those setTimeout (preferred if needed) and setInterval (usually discouraged) is we interrupt the main thread, execute some code and then continue with the main thread. This is an "emulated" asynchronous execution, but not really it.
  
    One way to have truly asynchronous code execution is to use [Worker Threads](https://nodejs.org/dist/latest-v10.x/docs/api/worker_threads.html (Node.js Docs)) which is still experimental feature in Node.js. Worker Thread basically create a separate process running side by side with the main thread and communicating with the latter through message channels. While this feature is experimental it is still possible to try it using `--experimental-worker` flag. 
    
    The main thing to check here is whether SCONE will allow starting this worker process. By default it doesn't allow spawning child processes from the currently running one. It might not allow starting a worker thread as well (needs to be checked).
     
2) **[NOT RELEVANT ANYMORE]** ~~PatrIoT's current prototype supports unidirected graph-based apps only. So there are no elements with several outgoing or incoming edges (ports). We would need to change the event processing code to support multiedge elements. This is tricky, because we would need to account for the timing of event arrivals (some may be delayed for some reason so we would need to wait for those in order to proceed).~~

3) The PatrIoT modules (elements & services) written in Javascript might not be able to support computationally intensive operations (e.g. face or voice recognition, machine learning, etc.). The modules providing such a functionality are written in C, Java or Python. We might need to somehow run modules written in other languages from within the Javascript. This is challenging because SCONE doesn't allow to spawn child processes. 

4) **[NOT RELEVANT ANYMORE]** ~~One weak point of the system is that by default any element (even untrusted one) can receive the events he is subscribed to, even if the event is not for this element or the app it is part of. It will happen that there are several apps depending on the same element. This means that the events that element generates will be seen by all these apps, no matter if they asked for it or no. We need to  specify and verify the destination for each of the events.~~  

## Notes

#### [SOLVED] `npm install` problems in SCONE 

When trying to use the current prototype of PatrIoT in SCONE Docker container, I stumbled upon the following error message:

```
/patriot/node_modules/buffertools/buffertools.js:26
	if (e.code !== 'MODULE_NOT_FOUND') throw e;
	                                   ^

Error: The module '/patriot/node_modules/buffertools/build/Release/buffertools.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 64. This version of Node.js requires
NODE_MODULE_VERSION 57. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
    at Object.Module._extensions..node (module.js:672:18)
    at Module.load (module.js:556:32)
    at tryModuleLoad (module.js:499:12)
    at Function.Module._load (module.js:491:3)
    at Module.require (module.js:587:17)
    at require (internal/module.js:11:18)
    at Object.<anonymous> (/patriot/node_modules/buffertools/buffertools.js:24:20)
    at Module._compile (module.js:643:30)
    at Object.Module._extensions..js (module.js:654:10)
    at Module.load (module.js:556:32)
```

As the error says the npm packages PatrIoT depends on were compiled for my local computer's architecture and node version, and are not compatible with the environment of SCONE's container. I needed to rebuild and install these all npm packages from within SCONE's container. 

SCONE Docker image is based on Alpine linux which has both node/npm and any other packages available for installation from the official repositories. The problem is when I tried to rebuild and install the necessary packages by running `npm rebuild` in the project directory, I've got the following error:

```
/patriot # npm rebuild

> buffertools@2.1.6 install /patriot/node_modules/buffertools
> node-gyp rebuild
```

After checking the `npm-debug.log` file, I found out that both `npm rebuild` and `npm install` commands use `child.process` Javascript method which spawns a separate process for packages' source code compliation. While this should usually work fine, it fails in SCONE container because SCONE currently (subject to change in future) does *NOT* allow spawning another process besides the main one currently running. This is done for security reasons. Any attempt to spawn additional child process will fail with ENOSYS error. This is briefly explained [here](https://sconedocs.github.io/Nodejs/).

In order to overcome this issue, I pulled a default Alpine Linux Docker image from the dockerhub and used it to recompile the project's packages. After that I could just put a `node_modules` folder with the recompiled packages into the SCONE's docker container. With this "hack" the PatrIoT prototype works fine within SCONE Docker container. 

To automate the things, I wrote a script that first fetches the latest PatrIoT version from the git repository, builds an Alpine Docker image with preinstalled packages needed for npm packages compilateion (python, g++, make), runs this image with the `npm rebuild` command, and, finally, builds the PatrIoT server image with the precompiled packages ready to be executed in SCONE.

The scripts in the `scripts/sgx/` project's folder are to be executed on SGX machine. 
First, you run `./setup.sh` script to prepare everything, and then you run `./run-patriot-container.sh` script to execute PatrIoT inside SCONE.

Note: 
- in order to pull SCONE:nodejs Docker image you need to be logged in with your Docker Hub account that was previously authorized by the SCONE maintainers. 
- SGX machine needs to have Docker and SGX SDK installed

#### [PARTIALLY SOLVED] Tensorflow.js Mobilenet Model using deprecated calls

Currently available version of `@tensorflow-models/mobilenet` npm package still uses deprecated calls to various functions (e.g. loadModel(), fromPixels()). It still works though, but causes a bunch of deprecation warning appear at the stdout. 

The source code available at the [Github](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet) have been upgraded to fix this, but was not yet pushed to npm repository apparently. Until a new version of the package appears there, we can modify the source code manually:

 Files to modify:
 
 `node_modules/@tensorflow-models/mobilenet/dist/index.js`;
 
 `node_modules/@tensorflow-models/mobilenet/dist/mobilenet.js`
 
 ```javascript
// return [4, tf.loadModel(this.path)];     // OLD
return [4, tf.loadLayersModel(this.path)];  // NEW
```

```javascript
// img = tf.fromPixels(img);        // OLD
img = tf.browser.fromPixels(img);   // NEW
```

One way to always use the latest version of the mobilnet package is to install it from the master branch of the Github repo. The process is explained [here](https://stackoverflow.com/questions/8243527/use-git-dependencies-with-npm-and-node-on-heroku/8306715#8306715). 

#### Outdated Alpine Linux dependancy

SCONE curated Docker images is built on outdated Alpine Linux image (v 3.6). The latest version of Alpine Linux Docker image is v 3.9.

The latest Alpine Docker image has the newest node and npm packages versions, which compile packages differently as compared with previous versions. This is crucial, since failure to compile at least one package of the project leads to failure of the whole PatrIoT project.

One workaround is to use the previous version of Alpine Docker image for crosscompiling the npm packages. More specifically v 3.8. This version still works as intended. That's why from now on we need to specify the version of Alpine we want to pull from the Docker Hub for crosscompilation (Docker files were updated accordingly in `/script` folder of the project).

#### No support for tfjs-node (Tensorflow.js) npm module in Alpine Linux

Tensorflow.js for Node.js comes with a special module tfjs-node which makes running Tensorflow inside node faster. It uses C++ source code, instead of pure JS. Although, you can still run JS version of Tensorflow.js package inside node without any modification, it will be much slower as compared with the C version. So having tfjs-node package installed is preferred.

But we're unable to use tfjs-node in our project. The reason for that is that tfjs-node module is compiled against glibc libraries and is supposed to be used on GLIBC compatible OSes (e.g. Ubuntu). PatrIoT, on the other hand, is using SCONE Docker images which is based on Alpine Linux. Alpine linux is a MUSL-based OS and doesn't contain the libraries tfjs-node expects to have access to.


