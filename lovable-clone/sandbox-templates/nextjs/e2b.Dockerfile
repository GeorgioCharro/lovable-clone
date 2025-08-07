FROM node:21-slim

# Install system dependencies
RUN apt-get update && apt-get install -y curl rsync && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable corepack and activate latest pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy script and make it executable
COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Set working directory
WORKDIR /home/user/nextjs-app

# Create a new Next.js app using pnpm
RUN pnpm create next-app . --yes

# Install shadcn-ui locally as dev dependency
RUN pnpm add -D shadcn-ui

# Use pnpm exec to run shadcn CLI
RUN pnpm exec shadcn-ui init --yes -b neutral --force
RUN pnpm exec shadcn-ui add --all --yes

# Move everything to /home/user and clean up
RUN rsync -a /home/user/nextjs-app/ /home/user/ && rm -rf /home/user/nextjs-app
