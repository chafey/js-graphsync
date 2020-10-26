#!/bin/bash
ADDR="$(ipfs id --format="<addrs>" | grep "/ip4/127.0.0.1/tcp/4001/p2p" | head -1)"
echo $ADDR
node index.js $ADDR Qme98eG7WKx6VEqf3Jza7rp9CRXgSHD7o8SL5KoDggH2VX # helloworld.json UnisFSV1
#node index.js $ADDR bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae # hello.json DAGCBOR
#node index.js $ADDR QmS3V8uLR5bzjxBWzC4oXxSV7ryStjCGxTuTiuB91sMR9c # go1.15.2.linux-amd64.tar.gz
echo ""