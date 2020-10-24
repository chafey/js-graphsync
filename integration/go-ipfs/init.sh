#!/bin/sh
#rm -rf ~/.ipfs
ipfs init
ipfs log level graphsync debug
ipfs log level graphsync_network debug
#ipfs id | jq -r .ID > ../../.env
ipfs config --json Experimental.GraphsyncEnabled true
ipfs add -q hello.json
# Qme98eG7WKx6VEqf3Jza7rp9CRXgSHD7o8SL5KoDggH2VX
ipfs dag put hello.json
# bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae
