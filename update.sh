#!/bin/bash
apt-get update
apt-get install
apt-get upgrade
apt-get dist-upgrade
apt-get install git curl nodejs npm nvm n -y
curl -o /usr/local/bin/n https://raw.githubusercontent.com/visionmedia/n/master/bin/n
chmod +x /usr/local/bin/n
n stable