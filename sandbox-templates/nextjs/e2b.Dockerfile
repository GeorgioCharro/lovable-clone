FROM node:21-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV CI=1
ENV COREPACK_ENABLE_DOWNLOADS=0

# OS deps
RUN apt-get update \
  && apt-get install -y --no-install-recommends bash curl dos2unix ca-certificates git rsync \
  && rm -rf /var/lib/apt/lists/*

# Corepack + pin PNPM
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Single PNPM store under /home/user (no root store)
ENV PNPM_HOME="/home/user/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN mkdir -p "$PNPM_HOME" /home/user/.pnpm-store \
  && pnpm config set store-dir /home/user/.pnpm-store --global

# Bring in start script
COPY compile_page.sh /compile_page.sh
RUN dos2unix /compile_page.sh && chmod +x /compile_page.sh

# --- Scaffold in a clean temp dir to avoid conflicts ---
WORKDIR /tmp/app

# Scaffold WITHOUT installing, then pin packageManager, install once, add shadcn
RUN pnpm create next-app@latest . --yes --no-install \
  && node -e "const fs=require('fs');const p='./package.json';const j=JSON.parse(fs.readFileSync(p,'utf8'));j.packageManager='pnpm@10.14.0';fs.writeFileSync(p,JSON.stringify(j,null,2));" \
  && pnpm install --frozen-lockfile=false \
  && pnpm dlx shadcn@latest init --yes -b neutral --force \
  && pnpm dlx shadcn@latest add --all --yes

# Move the app into /home/user (where your script expects it)
RUN rsync -a --delete-excluded --exclude='.git' /tmp/app/ /home/user/ \
  && rm -rf /tmp/app

# Final workdir where the app now lives
WORKDIR /home/user

EXPOSE 3000
CMD ["/compile_page.sh"]
