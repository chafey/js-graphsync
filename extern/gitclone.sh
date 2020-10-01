#!/bin/sh
git clone git@github.com:ipld/js-dag-pb.git
cd js-dag-pb
git pull
npm install
npm run build