#sudo docker run --rm --device=/dev/isgx -p 3000:3000 patriot-server
sudo docker run -it --rm -d --name patriot --device=/dev/isgx -p 3000:3000 patriot-server


