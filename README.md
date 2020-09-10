# bmd-hdsdi-rtr

Node.js web server to control and monitor Blackmagic HD-SDI Video routers. 



# setup instructions

Assuming Node.js has already been installed, clone the repo, unzip it, cd into it... 
run `ls` to make sure you see `package.json`.
then run the following commands.

```
npm install
npm run build
```

## how to set ip address for BMD video hub & start the server.
```
node server [videohub ip address]
```
for example...
```
node server '10.0.99.50'
```

## check the server on localhost
The videohub web server will be running on port 3000 by default.  This can be changed within `server.js`.
Go to a browser on the same system running the node server and enter this url:  `http://localhost:3000`

You should see the router sources on the left column, destinations on the right column.

If you're hosting this server from a Linux OS you'll need to update your firewall policy to allow inbound connections on port 3000.  Isolate this rule to the subnet or ethernet interface corresponding to your production LAN.  I don't recommend opening this server to the public internet as it's not setup for `https` or basic authentication. 

other worktations on your production LAN should be able to load the videohub web server at: `http://[ip address hosting node server]:3000`


## hope it works!