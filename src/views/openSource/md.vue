<template>
  <page-container title="乐思平台项目介绍">
    <div class="lesi-platform-intro">
      <!-- 头部标题区域 -->
      <div class="header-section">
        <h1 class="main-title">乐思平台</h1>
        <p class="subtitle">基于 .NET 8 和 Vue 3 的现代化AI识别与管理系统</p>
      </div>

      <!-- 项目卡片区域 -->
      <div class="project-cards">
        <!-- 单体应用版本 -->
        <el-card class="project-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h2>🎯 单体应用版本(Gitee)</h2>
            </div>
          </template>
          <div class="card-content">
            <p>完整的单体架构实现，适合学习和快速部署</p>
            <div class="project-link">
              <el-link
                type="primary"
                :underline="false"
                href="https://gitee.com/libihao520/ai-recognition-system"
                target="_blank"
              >
                <el-icon><MapLocation /></el-icon>
                Gitee 仓库地址
              </el-link>
            </div>
            <div class="badges">
              <el-tag type="danger" size="small"> 🌟Star: 欢迎点亮 </el-tag>
              <el-tag type="warning" size="small">
                <el-icon><Chicken /></el-icon>
                Fork: 欢迎贡献
              </el-tag>
            </div>
          </div>
        </el-card>

        <!-- 微服务版本 -->
        <el-card class="project-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h2>🚀 微服务版本(github)</h2>
            </div>
          </template>
          <div class="card-content">
            <div class="microservice-links">
              <div class="link-item">
                <el-tag type="info" size="small">前端</el-tag>
                <el-link
                  :underline="false"
                  href="https://github.com/Libihao520/LeSi-Platform-Web"
                  target="_blank"
                >
                  LeSi-Platform-Web
                </el-link>
              </div>
              <div class="link-item">
                <el-tag type="info" size="small">网关</el-tag>
                <el-link
                  :underline="false"
                  href="https://github.com/Libihao520/LeSi-Platform-Api"
                  target="_blank"
                >
                  LeSi-Platform-Api
                </el-link>
              </div>
              <div class="link-item">
                <el-tag type="info" size="small">管理后台</el-tag>
                <el-link
                  :underline="false"
                  href="https://github.com/Libihao520/LeSi-Admin-Api"
                  target="_blank"
                >
                  LeSi-Admin-Api
                </el-link>
              </div>
              <div class="link-item">
                <el-tag type="info" size="small">AI核心</el-tag>
                <el-link
                  :underline="false"
                  href="https://github.com/Libihao520/LeSi-AI-Api"
                  target="_blank"
                >
                  LeSi-AI-Api
                </el-link>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 演示地址 -->
        <el-card class="project-card demo-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h2>🌐 在线演示</h2>
            </div>
          </template>
          <div class="card-content">
            <div class="demo-info">
              <el-link
                type="success"
                :underline="false"
                href="https://lesi.yumeng-kj.com/login"
                target="_blank"
              >
                <el-icon><Monitor /></el-icon>
                演示地址
              </el-link>
              <div class="login-info">
                <p>测试账号：<el-tag size="small">lbhlbh</el-tag></p>
                <p>测试密码：<el-tag size="small">123456</el-tag></p>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 功能模块 -->
      <div class="section">
        <h2 class="section-title">✨ 功能模块</h2>
        <el-row :gutter="20">
          <el-col
            :xs="12"
            :sm="8"
            :md="6"
            v-for="(feature, index) in features"
            :key="index"
          >
            <div class="feature-item">
              <div class="feature-icon">{{ feature.icon }}</div>
              <h3>{{ feature.title }}</h3>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 技术栈 -->
      <div class="section">
        <h2 class="section-title">🛠️ 技术栈</h2>
        <div class="tech-stack">
          <div class="tech-category">
            <h3>后端技术</h3>
            <el-tag
              type="success"
              v-for="tech in backendTechs"
              :key="tech"
              class="tech-tag"
            >
              {{ tech }}
            </el-tag>
          </div>
          <div class="tech-category">
            <h3>前端技术</h3>
            <el-tag
              type="primary"
              v-for="tech in frontendTechs"
              :key="tech"
              class="tech-tag"
            >
              {{ tech }}
            </el-tag>
          </div>
          <div class="tech-category">
            <h3>服务通讯</h3>
            <el-tag
              type="warning"
              v-for="tech in communicationTechs"
              :key="tech"
              class="tech-tag"
            >
              {{ tech }}
            </el-tag>
          </div>
          <div class="tech-category">
            <h3>运维部署</h3>
            <el-tag
              type="danger"
              v-for="tech in devopsTechs"
              :key="tech"
              class="tech-tag"
            >
              {{ tech }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </page-container>
</template>

<script setup>
import { ref } from "vue";
import { Pear, Chicken, MapLocation } from "@element-plus/icons-vue";
// 功能模块数据
const features = ref([
  { icon: "🔐", title: "登录注册" },
  { icon: "📊", title: "数据大屏" },
  { icon: "📚", title: "题库系统" },
  { icon: "🤖", title: "AI模块" },
  { icon: "🧰", title: "工具箱" },
  { icon: "👤", title: "个人中心" },
]);

// 技术栈数据
const backendTechs = ref([
  ".NET 8/9",
  "EFCore",
  "Dapper",
  "MySQL",
  "Redis",
  "SignalR",
  "Autofac",
  "AutoMapper",
  "EPPlus",
  "SharpDocx",
  "QRCode",
  "DDD",
  "CQRS",
]);

const frontendTechs = ref([
  "Vue 3",
  "Node.js",
  "Vuex",
  "Axios",
  "Promise",
  "Element UI",
  "Element Plus",
  "Pinia",
]);

const communicationTechs = ref(["gRPC", "RabbitMQ/Kafka", "SignalR"]);

const devopsTechs = ref(["Kubernetes", "Docker", "Jenkins CI/CD"]);
</script>

<style lang="scss" scoped>
.lesi-platform-intro {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;

  .main-title {
    font-size: 2.5rem;
    color: #409eff;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .subtitle {
    font-size: 1.2rem;
    color: #666;
  }
}

.project-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.project-card {
  height: 100%;

  :deep(.el-card__header) {
    background: linear-gradient(135deg, #409eff, #79bbff);
    color: white;

    h2 {
      margin: 0;
      font-size: 1.2rem;
    }
  }
}

.demo-card {
  :deep(.el-card__header) {
    background: linear-gradient(135deg, #67c23a, #95de64);
  }
}

.card-content {
  padding: 15px;
}

.badges {
  margin-top: 15px;

  .el-tag {
    margin-right: 10px;
    margin-bottom: 5px;
  }
}

.microservice-links {
  .link-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .el-tag {
      margin-right: 10px;
      min-width: 60px;
      justify-content: center;
    }

    .el-link {
      flex: 1;
    }
  }
}

.demo-info {
  text-align: center;

  .login-info {
    margin-top: 15px;

    p {
      margin: 8px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
  }
}

.section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.5rem;
  color: #409eff;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
}

.feature-item {
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: linear-gradient(135deg, #409eff, #79bbff);
    color: white;
  }

  .feature-icon {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  h3 {
    margin: 0;
    font-size: 1rem;
  }
}

.tech-stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.tech-category {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;

  h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #409eff;
  }
}

.tech-tag {
  margin: 5px;
  font-weight: 500;
}

// 响应式设计
@media (max-width: 768px) {
  .project-cards {
    grid-template-columns: 1fr;
  }

  .tech-stack {
    grid-template-columns: 1fr;
  }

  .header-section {
    .main-title {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }
  }
}
</style>