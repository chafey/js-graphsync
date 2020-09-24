#!/bin/sh
ipfs init
ipfs config --json Experimental.GraphsyncEnabled true
ipfs add -q hello.json
# Qme98eG7WKx6VEqf3Jza7rp9CRXgSHD7o8SL5KoDggH2VX
