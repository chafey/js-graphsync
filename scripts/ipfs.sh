#!/bin/sh

export IPFS_PATH=$PWD/.ipfs
rm -rf $IPFS_PATH
ipfs init
ipfs config --json Experimental.GraphsyncEnabled true
echo {\"hello\" : \"world\"} | ipfs dag put
ipfs daemon