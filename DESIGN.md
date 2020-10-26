Design Notes
============

libp2p Dependency
-----------------

This library is specifically designed to use libp2p for all network communications.  While the graphsync protocol does not require
libp2p, there may never be a need for it to run on anything but libp2p so adding a layer/abstraction into this library is unnecessary.
js-graphsync requires a node object which conforms to the libp2p node interface.  This interface only dependency primarily exists to
support unit testing, but could possibly allow utilization of a non libp2p network transport library via a bridge

PeerId
------

All graphsync communication begins with a requester sending a message to a responder.  Outside of this initial connection, the rest
of the graphsync protocol can be implemented by simply referencing peerids (rather than transport specific information such as 
multiaddr).  Given this, the graphsync api will only utilize peer ids for identifying requesters and responders.  It is therefore
up to the user of this library to ensure libp2p can connect to a peer given just a peer id.  One way to do this is by setting
multiaddr's for peers in the address book.  Note that using peerids means that messages can be sent or received over any transport,
connection or stream made between the requester and responder.  

RequestId Generation
--------------------

The graphsync library maintains a request id counter for each peer.  This request id counter is initialized to zero when a new
libp2p connection is established for that peer and there are no other existing connections to that peer.  The request id counter
is incremented each time a message with a request for that peer is created.  Note that request ids will be reused if all underlying
connections to a peer are closed for some reason.  This behavior exists to avoid having to keep track of request id counters
for peers that are no longer active

Block Deduplication
-------------------

Since a given graph may reference the same block multiple times, it makes sense to avoid sending the same block more than once
for a given request.  To accomplish this, a responder needs to keep track of the block CIDs it has already sent to the requester so
it can check to see if a block needs to be sent or not before sending it.  Since a graphsync response could be very large, the list of CIDs could grow
quite large consuming large ammounts of memory - especially for responders serving up requests for many requesters.  Given this, the size of sent
block CID list needs to be bound, but how should be controlled by library users via strategy or pattern (e.g. LRU)

GraphExchange Object
--------------------

Requesters and responders both have an initialization sequence that looks like this:

1) Create libp2p Node
2) Create GraphExchange
3) Register Hooks with GraphExchange
4) Start libp2p node

NOTE: Starting the libp2p node before creating the GraphExchange may result in protocol errors returned to GraphSync requesters as
it will immediately start accepting connections but not have a handler set for the graphsync protocol.

Request Object
--------------

The Request object is returned to requesters after submitting a request to a responder.  The Request object provides methods to monitor and
control the request process.  This includes checking on the status, canceling and pausing

Response Object
---------------

The Response object is provided to responders when processing the response for a received request from a requester.  The Response object provides
functions to monitor status and control the request process.  This includes checking on status, canceling and pausing.


TODO
----
* Figure out what libp2p does in terms of flow control (we want to avoid OOM when sending large responses to clients over slow networks)
* do we need RegisterPersistenceOption and UnregisterPersistenceOption?  Can externalize this out of the library into the storer/loader functions passed in
* Someone requested block de-duplication accross multiple requests - who was this and why is it needed?  Doing so makes block-deduplication more difficult (see issues related to Block Deduplication for a single request above)  Feedback from @mikeal - block deduplication is something that should happen but is not guaranteed 
* Would be nice to use strategy pattern to handle graph traversal and graph validation logic (rather than bind to selector?)  This would also be a good way
  to handle the extensions metadata that go-graphsync uses
* Need to figure out how to handle libp2p errors when trying to send a message
  * timeout
  * connection closed
* Need to figure out if a libp2p stream can have multiple writers?


Selectors
---------
