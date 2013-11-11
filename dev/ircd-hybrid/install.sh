#!/bin/bash

apt-get update
apt-get install -y ircd-hybrid
cp -f /vagrant/dev/ircd-hybrid/ircd.conf /etc/ircd-hybrid/ircd.conf
cp -f /vagrant/dev/ircd-hybrid/ircd.motd /etc/ircd-hybrid/ircd.motd
service ircd-hybrid start
