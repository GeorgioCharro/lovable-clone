FROM node:21-slim

# Install system dependencies (add bash + dos2unix)
RUN apt-get update \
  && apt-get install -y curl rsync bash dos2unix \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable corepack and activate specific pnpm version
RUN corepack enable && corepack prepare pnpm@8.11.0 --activate

# Copy script and fix permissions + line endings
COPY compile_page.sh /compile_page.sh
RUN dos2unix /compile_page.sh && chmod +x /compile_page.sh

# Set working directory
WORKDIR /home/user/nextjs-app

# Create a new Next.js app using pnpm
RUN pnpm create next-app . --yes

# Install shadcn-ui locally as dev dependency
RUN pnpm dlx shadcn@latest init --yes -b neutral --force
RUN pnpm dlx shadcn@latest add --all --yes

# Move everything to /home/user and clean up
RUN rsync -a /home/user/nextjs-app/ /home/user/ && rm -rf /home/user/nextjs-app

# Final workdir
WORKDIR /home/user
