#!/bin/bash

# Change to app directory
cd /home/user || exit 1

# Start dev server with Turbopack and bind to all interfaces
pnpm exec next dev --turbopack --hostname 0.0.0.0 --port 3000 &
SERVER_PID=$!

# Wait until the server is responsive
echo "Waiting for Next.js dev server to start on port 3000..."
for _ in {1..600}; do
  if curl -sSf http://localhost:3000 > /dev/null; then
    echo "✅ Server started at http://0.0.0.0:3000"
    wait $SERVER_PID
    exit 0
  fi
  sleep 0.1
done

echo "❌ Timeout: Server failed to start"
kill $SERVER_PID 2>/dev/null || true
exit 1