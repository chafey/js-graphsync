# js-graphsync Requester Example

This is an example of a graphsync requester written in JavaScript.  

Current Status:
* Creates libp2p connection that is compatible with go-ipfs graphsync.  Verified to interoperate with go-ipfs 0.7 with graphsync enabled
* Sends request with hard coded CID and selector

ToDo:
* Handle messages sent from responder (in progress)
* Allow user to pass in mutliaddr and cid and pass to requester


## Building

```bash
$ npm install
```

## Running

Start up the js-graphsync responder first and then:

```bash
$ node .
```

