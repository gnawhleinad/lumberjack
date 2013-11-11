#!/bin/bash

install=( "ircd-hybrid" "irssi" "nodejs" "mongodb" "git" )

for i in "${install[@]}"
do
    eval "bash /vagrant/dev/$i/install.sh &> /dev/null"
done
