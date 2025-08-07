#!/bin/bash

# Change to app directory
cd /home/user || exit 1

# Install dependencies just in case
pnpm install

# Start dev server with turbopack
pnpm dev --turbo &
SERVER_PID=$!

# Wait until the server is responsive
echo "Waiting for Next.js dev server to start on port 3000..."
until curl -s http://localhost:3000 > /dev/null; do
  sleep 0.5
done

echo "✅ Server started at http://localhost:3000"

# Wait forever (or until server crashes)
wait $SERVER_PID
