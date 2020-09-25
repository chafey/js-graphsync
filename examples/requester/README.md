This is an example of a graphsync requester written in JavaScript.  

Current Status:
* Creates libp2p connection that is compatible with go-ipfs 0.7 go-graphsync.  
* Sends request with hard coded CID and selector

ToDo:
* Handle messages sent from responder (in progress)
* Allow user to pass in mutliaddr and cid and pass to requester


Running (currently hard coded to work with js-graphsync responder - make sure it is running!)
```
> node . 
```
