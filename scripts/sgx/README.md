First, build the PatrIoT for SCONE:
	 just run setup.sh script.
	 It uses Alpine docker image to cross-compile all necessary packages and then puts them nicely into the SCONE Node.js image.

Second, run PatrIoT in SCONE Node.js container:
	 just run run-patriot-container.sh script
	 The script will run in daemon mode, so once started it will return you to the CLI.
	 In order to see PatrIoT's output run the following command:
	 sudo docker logs -f patriot
