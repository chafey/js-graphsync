# js-graphsync Requester Example

This is an example of a graphsync requester written in JavaScript using js-graphsync

Current Status:
* Allow user to pass in mutliaddr and cid and pass to requester
* Creates libp2p connection that is compatible with go-ipfs graphsync.  Verified to interoperate with go-ipfs 0.7 with graphsync enabled
* Sends request to responder and wait for it to complete

ToDo:
* Print out data received

## Building

```bash
$ npm install
```

## Running against go-ipfs

Start up go-ipfs first and then:

```bash
./get-from-go-ipfs.sh
```

## Running against js-graphsync responder

Start up go-ipfs first and then:

```bash
./get-from-js-graphsync-responder.sh
```
