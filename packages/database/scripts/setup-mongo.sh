#!/bin/bash
set -e

mongosh --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"localhost:27017"}]})'
mongosh /scripts/init-mongo.js
