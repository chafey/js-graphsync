# js-graphsync
JavaScript Implementation of GraphSync

# Status

js-graphsync is under active development and not yet ready for use, see high level development plan below for
where things are at.  Currently all work is being done in the examples/graphsync folder, the code in /src
is currently dead.

# Building

NOTE - this library depends on @ipld/js-dag-pb which is not yet published to NPM.  To work around this
for now, you must clone the repository into a subdirectory and build it:

```sh
npm install
cd extern
git clone git@github.com:ipld/js-dag-pb.git
./build.sh
```

run build.sh periodically to keep up to date with the latest changes in js-dag-pb

# Running Examples

## Running go-ipfs as graphsync responder

```sh
cd test/go-ipfs
./init.sh
ipfs daemon
```

## Running js-graphsync responder

```sh
cd examples/graphsync
node responder.js
```

## Running go-ipfs graphsync-get test app against go-ipfs

```sh
cd test/go-ipfs
./get-from-go-ipfs.sh
```

## Running go-ipfs graphsync-get test app against js-graphsync responder

```sh
cd test/go-ipfs
./get-from-js-graphsync-responder.sh
```

## Running js-graphsync requester against go-ipfs

```sh
cd examples/graphsync
node requester.js
```

## Running js-graphsync requester against js-graphsync responder

```sh
cd examples/graphsync
node requester.js
```

# Links

* [Requirements Document](https://docs.google.com/document/d/1cPXBWnpgDI3f8L5cmEAcBL_xyJ7cfbBLNWZPN9VJUJU/edit?usp=sharing)
* [go-graphsync](https://github.com/ipfs/go-graphsync)
* [GraphSync Specifications](https://github.com/ipld/specs/blob/master/block-layer/graphsync/graphsync.md)

# High Level Development Plan

- [X] Spike js-graphsync requester and verify against go-graphsync responder
- [X] Spike js-graphsync responder and verify against both js-graphsync requester and go-ipfs graphsync-get
- [ ] API design for all intended features (in progress)  
- [ ] Refactor js-graphsync requester to new API design (in progress)
- [ ] Add CI to run unit tests 
- [ ] Add CI to run integration test of js-graphsync requester with go-graphsync responder
- [ ] Refactor js-graphsync responder to new API design
- [ ] Add CI to run integration test of js-graphsync responder with go-graphsync requester
- [ ] Add block de-duplication to js-graphsync responder for single requests
- [ ] Add block de-duplication to js-graphsync responder for multiple requests from same requester
- [ ] Add support for canceling requests to js-graphsync
- [ ] Add CID skip to js-graphsync requester and responder
- [ ] Add pause/resume functionality to js-graphsync requester and responder
- [ ] Add hook to responder to support resource consumption accounting
- [ ] Add hook to responder to support DOS mitigation
- [ ] Add hook to requester to validate and buffer received blocks
 
# go-ipfs graphsync notes

* Appears to respond to graphsync requests on swarm endpoints
    * /ip4/127.0.0.1/tcp/4001 works at least
    * UDP does not seem to work
* Swarm endpoints appear to be configured as follows
    * Encryption:
        * TLS - highest priority / default encryption
        * NOISE - preferred over TLS but not always available so lower priority 
    * Multiplex
        * YAMUX - highest priorty - used for communicating with go-ipfs nodes only
        * MPLEX - lower priority - used for communicating with all non go-ipfs apps

