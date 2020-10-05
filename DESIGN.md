Design Notes
============

Key Objects
-----------
* Network - network abstraction for libp2p so code can be unit tested without actually making network/libp2p requests.  This matches the go-graphsync design
  * NOTE - TBD if this interface matches libp2p or is a narrower/simpler version
* GraphExchange - manages the graphsync protocol for a given Network instance.  This includes sending graphsync requests to one or more peers, receiving graphsync responses for one or more peers, interfacing to a block store, invoking hooks and graphsync protocol validation.  This matches the go-graphsync design
  * ~Hooks~
    * registerIncomingRequestHook(hookFunction) - called before newly received request messages are processed
    * registerIncomingResponseHook(hookFunction) - called before newly received response messages are processed
    * registerOutgoingRequestHook(hookFunction) - called before a request message is sent to a peer
    * registerOutgoingBlockHook(hookFunction) - called after each block in a response is sent to a peer
    * registerRequestUpdateHook(hookFunction) - called when a request is updated
    * registerCompletedResponseListener(listenerFunction) - adds a listener on a responder for compelted responses
    * registerIncomingBlockHook(hookFunction) - called when a block is received and validated (put in blockstore)
    * registerRequestorCancelledListener(listenerFunction) - adds a listener on the responder for responses cancelled by the requestor.
    * registerResponseValidatorHook(hookFunction) - called to validate a received block.   
  * ~Request~ (only valid for requester)
    * sendRequest(peerId, rootCID, selector) - sends a graphsync request and returns a requestId that uniquely identifies this request
    * getRequestInfo(peerId, requestId) - returns information about a specific request
      * status
      * rootCID
      * selector
      * lastBlock (cid, path) 
    * cancelRequest(peerId, requestId) - cancels a given request 
    * pauseRequest(peerId, requestId) - pauses a given request 
    * resumeRequest(peerId, requestId) - resumes a given request
  * ~Response~ (only valid for responder) 
    * getResponseInfo(peerId, requestId) - returns information about the response for a given request
      * status
      * rootCID
      * selector
      * lastBlock(cid, path)
    * cancelResponse(peerId, requestId) - cancels a given response to a request 
    * pauseResponse(peerId, requestId) - pauses a given response to a request 
    * resumeResponse(peerId, requestId) - resumes a given response to a request

* Storer - function that stores a block in a block store.  This matches the go-graphsync design
* Loader - function that retrieves a block from a block store.  This matches the go-graphsync design
* Logger - object that handles logging - interfaces matches that of console
* 

Block Deduplication
-------------------
Since a given graph may reference the same block multiple times, it makes sense to avoid sending the same block more than once
for a given request.  To accomplish this, a responder would need to keep track of the block CIDs it has already sent as
responses and make sure a block isn't in that list.  One issue with this is that a graph could be quite large and each block we send
back requries memory to keep track of creating an out of memory scenario.  A few options:
* Limit the size of responses (max number of blocks returned?)
* implement a LRU on the CIDs sent to keep memory low - this will result in blocks being sent more than once

TODO
----
* Figure out what libp2p does in terms of flow control (we want to avoid OOM when sending large responses to clients over slow networks)
* What rules should there be around request id generation?
  * Must they start at zero?
  * Must they always increment by one?
  * Is request id counter associated with the requester or peerid?
    * If peerid, should the counter be reset to zero if the underlying connection is closed?
* do we need RegisterPersistenceOption and UnregisterPersistenceOption?  Can externalize this out of the library into the storer/loader functions passed in
* Someone requested block de-duplication accross multiple requests - who was this and why is it needed?  Doing so makes block-deduplication more difficult (see issues related to Block Deduplication for a single request above)
* What is CID skip again?
* The GraphExchange interface is too wide IMO, but that is how go-graphsync is designed.  I would prefer the break out the
  request and response functionality into separate objects.  
* Would be nice to use strategy pattern to handle graph traversal and graph validation logic (rather than bind to selector?)  This would also be a good way
  to handle the extensions metadata that go-graphsync uses
* 
