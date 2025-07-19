# 使用Nginx作为基础镜像
FROM nginx:stable-alpine

WORKDIR /app
# 将dist文件夹中的文件复制到Nginx的html文件夹中
COPY dist/ /usr/share/nginx/html/

RUN echo "server { listen 8080; location / { root /usr/share/nginx/html; } }" > /etc/nginx/conf.d/default.conf
# 暴露端口
EXPOSE 8080

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]