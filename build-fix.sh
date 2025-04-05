#!/bin/bash

# This script will be used to fix the build process
# It ensures that the server code is correctly bundled and the client is in the right place

echo "Starting improved build process..."

# Clean any previous build artifacts
echo "Cleaning previous build..."
rm -rf dist

# First build the client (uses dist/public output dir from vite.config.ts)
echo "Building client with Vite..."
npx vite build

# Then bundle the server with proper configuration
echo "Bundling server code..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Make sure the public directory is correctly named/set up if needed
echo "Ensuring correct directory structure..."
if [ -d "dist/client" ] && [ ! -d "dist/public" ]; then
  echo "Moving dist/client to dist/public..."
  mkdir -p dist/public
  cp -r dist/client/* dist/public/
fi

echo "Build completed successfully!"
