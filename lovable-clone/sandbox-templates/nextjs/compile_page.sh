#!/bin/bash

# Change to app directory
cd /home/user || exit 1

# Install dependencies just in case
if ! pnpm install; then
  echo "❌ Failed to install dependencies"
  exit 1
fi

# Start dev server with turbopack
pnpm dev --turbo &
SERVER_PID=$!

# Give the server a moment to start and check if it's still running
sleep 2
if ! kill -0 $SERVER_PID 2>/dev/null; then
  echo "❌ Failed to start dev server"
  exit 1
fi

# Wait until the server is responsive
echo "Waiting for Next.js dev server to start on port 3000..."
TIMEOUT=60  # Maximum wait time in seconds
COUNTER=0
until curl -s http://localhost:3000 > /dev/null; do
  sleep 0.5
  COUNTER=$((COUNTER + 1))
  if [ $COUNTER -gt $((TIMEOUT * 2)) ]; then  # *2 because we sleep 0.5s each iteration
    echo "❌ Timeout: Server failed to start within ${TIMEOUT} seconds"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
  fi
done

echo "✅ Server started at http://localhost:3000"

# Wait forever (or until server crashes)
wait $SERVER_PID
