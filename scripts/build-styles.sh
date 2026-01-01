#!/bin/bash
set -e
echo "Building @ggprompts/styles..."
npx turbo build --filter=@ggprompts/styles
echo "Copying output..."
cp -r apps/styles/.next .next
echo "Build complete!"
