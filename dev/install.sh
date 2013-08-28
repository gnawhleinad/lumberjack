#!/bin/bash

install=( "ircd-hybrid" "irssi" "nodejs" "mongodb" "git" )

for i in "${install[@]}"
do
    eval "bash /vagrant/$i/install.sh &> /dev/null"
done
