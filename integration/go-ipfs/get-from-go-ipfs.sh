#!/bin/bash
ADDR="$(ipfs id --format="<addrs>" | grep "/ip4/127.0.0.1/tcp/4001/p2p" | head -1)"
echo $ADDR
./graphsync-get $ADDR Qme98eG7WKx6VEqf3Jza7rp9CRXgSHD7o8SL5KoDggH2VX
echo ""