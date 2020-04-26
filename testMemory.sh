#!/bin/bash
KEYS_COUNT=1000000

echo "Testing with Set"
for x in $(seq 1 4); do node ./setMemoryUsage.js $KEYS_COUNT; done

echo "Testing with Object"
for x in $(seq 1 4); do node ./objectMemoryUsage.js $KEYS_COUNT; done
