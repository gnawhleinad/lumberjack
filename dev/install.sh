#!/bin/bash

install=( "ircd-hybrid" "mongodb" "irssi" )

for i in "${install[@]}"
do
    eval "bash /vagrant/$i/install.sh &> /dev/null"
done
