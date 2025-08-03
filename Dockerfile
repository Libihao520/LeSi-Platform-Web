# 使用Node作为构建环境
FROM node:16-alpine AS builder

WORKDIR /app
# 复制 package.json 和 package-lock.json
COPY package*.json ./
# 安装依赖
RUN npm install
# 复制所有源文件
COPY . .
# 构建应用
RUN npm run build

# 使用Nginx作为生产环境
FROM nginx:stable-alpine

# 从构建阶段复制构建好的文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 自定义Nginx配置
RUN echo "server { \
    listen 8080; \
    server_name localhost; \
    \
    location / { \
        root /usr/share/nginx/html; \
        try_files \$uri \$uri/ /index.html; \
    } \
    \
    location /api { \
        proxy_pass http://platform-api:5157; \
        proxy_set_header Host \$host; \
        proxy_set_header X-Real-IP \$remote_addr; \
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for; \
    } \
}" > /etc/nginx/conf.d/default.conf
# 暴露端口
EXPOSE 8080

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]