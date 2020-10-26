#!/bin/sh

# start ipfs in background
ipfs daemon&
IPFSPID=$!

# give go-ipfs a few seconds to startup 
sleep 2

# enable debug messages for graphsync
ipfs log level graphsync debug
ipfs log level graphsync_network debug

echo "press control-c to stop"

# wait until IPFS is killed/stopped (control-c)
wait $IPFSPID