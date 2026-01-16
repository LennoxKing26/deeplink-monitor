# --- 1. 依赖安装 ---
# 🟢 修改点：升级到 node:20-alpine
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# --- 2. 构建源码 ---
# 🟢 修改点：升级到 node:20-alpine
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 🟢 修改点：ENV 格式优化 (加上了 =)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- 3. 生产环境运行 ---
# 🟢 修改点：升级到 node:20-alpine
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# ✅ 核心修改：让 Next.js 内部直接监听 4007
ENV PORT=4007 

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要文件
COPY --from=builder /app/public ./public
# 复制自动生成的独立运行包
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# ✅ 暴露 4007 端口
EXPOSE 4007

CMD ["node", "server.js"]
