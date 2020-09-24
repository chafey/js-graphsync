#!/bin/bash
#export IPFS_PATH=.ipfs
ADDR="$(ipfs id --format="<addrs>" | grep "tcp/4001" | head -1)"
echo $ADDR
requester $ADDR Qme98eG7WKx6VEqf3Jza7rp9CRXgSHD7o8SL5KoDggH2VX