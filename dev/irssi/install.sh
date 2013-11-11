#!/bin/bash

apt-get update
apt-get install -y irssi
mkdir /home/vagrant/.irssi
cp -f /vagrant/dev/irssi/config /home/vagrant/.irssi/config
chown -R vagrant:vagrant /home/vagrant/.irssi
