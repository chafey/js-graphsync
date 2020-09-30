# js-graphsync
JavaScript Implementation of GraphSync

# Running Unit Tests

> npm run test

# Links

* [Requirements Document](https://docs.google.com/document/d/1cPXBWnpgDI3f8L5cmEAcBL_xyJ7cfbBLNWZPN9VJUJU/edit?usp=sharing)
* [go-graphsync](https://github.com/ipfs/go-graphsync)
* [GraphSync Specifications](https://github.com/ipld/specs/blob/master/block-layer/graphsync/graphsync.md)

# High Level Development Strategy

- [X] Spike js-graphsync requester and verify against go-graphsync responder
- [X] Spike js-graphsync responder and verify against both js-graphsync requester and go-graphsync requester
- [ ] API design for all intended features  
- [ ] Refactor js-graphsync requester to new API design
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

