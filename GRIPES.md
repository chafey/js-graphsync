GraphSync Protocol Design Gripes
--------------------------------

* Uses protobuf for message codec requiring dependency on protobuf library.  Would be better to use CBOR 
* Combines request and responses into one message
  * Wrong place for this optimization - should be handled at transport layer (e.g. libp2p multiplexed streams)
* Multiple responses can be sent in one message 
  * Wrong place for this optimization - should be handled at transport layer (e.g. libp2p multiplexed streams)
  * Requires blocks to be sent separately from response
* Blocks are separate from response in message
  * Creates ambiguity about which blocks are associated with which response
  * Requires optional "metadata-response" extension to figure out association 
* Responder sends responses over separate channel from request
  * Wrong place for this optimization - should be handled at transport layer
  * Complicates implementation
  * Unexpected (not intuitive)
* De-duplication behavior completely controlled by responder
  * Complicates requester implementation due to various edge conditions (e.g. block not )
  * Constrains requester (e.g. blocks must be stored in same blockstore)
* Requester has no ability to control message size (responder decides message size)
  * Creates DOS attack vector
  * 

