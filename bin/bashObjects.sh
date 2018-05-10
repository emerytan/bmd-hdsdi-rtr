#!/bin/bash

function sources() {
    writeToPath="$HOME/localApps/gc-rtr/bin"
    readFrom=$1
    writetoFile="objectifySources.js"
    echo "var sources = {" > "$writeToPath/$writetoFile"
    awk '/^[0-9]{1,2}\ / { print }' $1 | while read a b; do 
        echo -e "\t${a}:\t'"$b"'," >> "$writeToPath/$writetoFile"
    done
    echo "}" >> "$writeToPath/$writetoFile"
    echo -e "\nmodule.exports = sources\n" >> "$writeToPath/$writetoFile"

    exit
}

function destination() {
    writeToPath="$HOME/localApps/gc-rtr/bin"
    readFrom=$1
    writetoFile="objectifyDestinations.js"
    echo "var destinations = {" > "$writeToPath/$writetoFile"
    awk '/^[0-9]{1,2}\ / { print }' $1 | while read a b; do 
        echo -e "\t${a}:\t'"$b"'," >> "$writeToPath/$writetoFile"
    done
    echo "}" >> "$writeToPath/$writetoFile"
    echo -e "\nmodule.exports = destinations\n" >> "$writeToPath/$writetoFile"

    exit
}


if [[ $2 == "srcs" ]]; then
    sources $1
elif [[ $2 == "dests" ]]; then
    destination $1
else
    echo -e "\nArgument error..."
    echo -e "first arg is source data."
    echo -e "second argument is source or destination"
    exit
fi

