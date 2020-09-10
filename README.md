# bmd-hdsdi-rtr

Node.js web server to control and monitor Blackmagic HD-SDI Video routers. 



# setup instructions

Assuming Node.js has already been installed, clone the repo, unzip it (if necessary), then cd into it and run the following commands.

```
npm install
```

If you get an error on the `npm install` command... double check nodejs installation by running `node --version` then make sure your shell is in the correct directory.  Use `ls` to show contents of your working directory - if you don't see `package.json` you need to cd into the bmd-hdsdi-rtr directory and try again!

Once you've successfully ran `npm install` you'll need to build the bundled javascript client code by running:

```
npm run build
```


## Set ip address for BMD video hub & start the server.
```
node server [videohub ip address]
```
for example...
```
node server '10.0.99.50'
```

<br>

## check the videohub web server on localhost
The videohub web server will be running on port 3000 by default.  This can be changed within `server.js`.


Go to a browser on the same system running the node server and enter this url:  `http://localhost:3000`


You should see the router sources on the left column, destinations on the right column.

If you're hosting this server from a Linux OS you'll need to update your firewall policy to allow inbound connections on port 3000.  Isolate this rule to the subnet or ethernet interface corresponding to your production LAN.  I don't recommend opening this server to the public internet as it's not setup for `https` or basic authentication. 

other worktations on your production LAN should be able to load the videohub web server at:

```
http://[ip address hosting node server]:3000
```


## hope it works!