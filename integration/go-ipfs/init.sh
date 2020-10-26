#!/bin/sh

# remove any existing .ipfs folder so we have a clean slate
#rm -rf ~/.ipfs 

# initialize ipfs - note that this will create a unique peerId
ipfs init

# enable graphsync functionality (off by default)
ipfs config --json Experimental.GraphsyncEnabled true

# Add hello.json as an IPFS file (UnixFSV1)
ipfs add -q hello.json
# Qme98eG7WKx6VEqf3Jza7rp9CRXgSHD7o8SL5KoDggH2VX

# Add hello.json as an IPLD Block
ipfs dag put hello.json
# bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae
