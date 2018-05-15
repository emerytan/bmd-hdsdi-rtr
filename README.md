# bmd-hdsdi-rtr

Node.js web server to control and monitor Blackmagic HD-SDI Video routers. 
This is a work in progress.  

# setup instructions
```
npm install
mpm run build
```

## how to set ip address for BMD video hub
```
node server 'ipaddress'
example...
node server '10.0.99.50'
```

# to-do list
- add rollup-plugin-babel to dev-dependencies for transpiling
- add a means to hide unwanted destinations on client page

