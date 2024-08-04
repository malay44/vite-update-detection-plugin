#!/bin/bash

# add .npmrc file with $NPM_TOKEN env variable
echo "⏳ Adding .npmrc file..."
echo "$NPM_TOKEN" > .npmrc
echo "✅ Done adding .npmrc file."

# run install
echo "⏳ Running install..."
npm ci
echo "✅ Done running install."