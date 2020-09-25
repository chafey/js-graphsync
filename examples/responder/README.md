# js-graphsync Responder Example

This is an example of a graphsync responder written in JavaScript.  

Current Status:
* Implements libp2p listener that is compatible with go-ipfs 0.7 go-graphsync.  Verified to handle requests from graphsync-get test app from the go-ipfs  
* Dumps out the CID and Selector for incoming graphsync requests

ToDo:
* Send hard coded blocks to the requester (in progress)
* Lookup root in block store and send it instead of hard coded block
* Traverse child blocks from root block and send them 
* Add support for filtering child blocks via selector

## Building

```bash
$ npm install
```

## Running

```bash
$ node .
```

You can now make graphsync requests using the js-graphsync requester or the go-ipfs graphsync-get application
