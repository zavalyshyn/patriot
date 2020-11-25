#!/bin/sh

mkdir ../keys

openssl req -newkey rsa:4096 -nodes -sha512 -x509 -days 3650 -nodes -out ../keys/server-cert.pem -keyout ../keys/server-key.pem -subj "/C=BE/ST=Ottignies/L=Louvain-la-Neuve/O=UCLouvain/CN=patriot"
