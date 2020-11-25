###

First create an Alpine Docker container. It will be used for crosscompiling the packages for SCONE environment.

JUst take the Alpine dockerfile and do what's needed.

Then crosscompile the packages.

Run the ./setup. sh script. It should do everything for you.

Now start the Patriot app in a Docker container by running ./strat-ptatriot-container.sh

It will start in Daemon mode so you would need to use "sudo docker logs -f patriot" to see the ouput.


