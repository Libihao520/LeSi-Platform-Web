<script setup>
import { ref } from 'vue'
import {
  Odometer,
  FolderOpened,
  Cpu,
  List,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom,
  Briefcase,
  Picture,
  Collection,
  Tickets,
  Management,
  DocumentCopy,
  FullScreen,
  Grid,
  ChatLineSquare,
  Notebook
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSubjectsOrFileLabel } from '../../api/exercises'

const userStore = useUserStore()
const router = useRouter()
const subjects = ref([])
const getTableList = async () => {
  const res = await getSubjectsOrFileLabel()
  subjects.value = []
  res.data.data.forEach((item) => {
    subjects.value.push({ label: item.label, value: item.value })
  })
}
getTableList()

onMounted(() => {
  userStore.getUser()
})

const handleCommand = async (key) => {
  if (key === 'logout') {
    await ElMessageBox.confirm('你确认要退出吗?', '温馨提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    //退出操作,清除本地信息
    userStore.removeToken()
    userStore.setUser({})
    router.push('/login')
  } else {
    router.push(`/user/${key}`)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/sjdp/yoloSjdp">
          <el-icon><Odometer /></el-icon>
          <span>数据大屏</span>
        </el-menu-item>

        <el-sub-menu index="/exercises">
          <template #title>
            <el-icon><Collection /></el-icon>
            <span>练题系统</span>
          </template>
          <el-menu-item index="/exercises/testPapersManage">
            <el-icon><Notebook /></el-icon>
            <span>题库管理</span>
          </el-menu-item>
          <div v-for="subject in subjects" :key="subject.value">
            <el-menu-item :index="'/exercises/mathematics/' + subject.label">
              <el-icon><Tickets /></el-icon>
              <span>{{ subject.label }}</span>
            </el-menu-item>
          </div>
          <el-menu-item index="/exercises/AchievementCenter">
            <el-icon><DocumentCopy /></el-icon>
            <span>成绩中心 </span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/yolo">
          <template #title>
            <el-icon><Cpu /></el-icon>
            <span>AI模块</span>
          </template>
          <el-menu-item index="/ai/modelManagement">
            <el-icon><Grid /></el-icon>
            <span>模型管理</span>
          </el-menu-item>
          <el-menu-item index="/yolo/yolorecognition">
            <el-icon><FullScreen /></el-icon>
            <span>在线识别入口</span>
          </el-menu-item>
          <el-menu-item index="/yolo/yolopkq">
            <el-icon><List /></el-icon>
            <span>识别记录</span>
          </el-menu-item>
          <el-menu-item index="/ai/dhck">
            <el-icon><ChatLineSquare /></el-icon>
            <span>在线问答</span>
          </el-menu-item>
          <!-- 
          <el-menu-item index="/yolo/yolocar">
            <el-icon><List /></el-icon>
            <span>车辆表单</span>
          </el-menu-item> -->
        </el-sub-menu>
        <el-sub-menu index="/gjx">
          <template #title>
            <el-icon><Briefcase /></el-icon>
            <span>工具箱</span>
          </template>

          <el-menu-item index="/gjx/ewm">
            <el-icon><Picture /></el-icon>
            <span>二维码生成</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>

          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/MyBlog" v-if="userStore.user.role === '超级管理员'">
            <el-icon><EditPen /></el-icon>
            <span>我的博客</span>
          </el-menu-item>
          <el-menu-item index="/user/RoleManagement">
            <el-icon><Management /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          用户昵称：<strong>{{ userStore.user.name || '默认值' }}</strong> 用户角色：<strong>{{
            userStore.user.role || '默认值'
          }}</strong>
        </div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <el-avatar :src="userStore.user.photo || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <!-- 折叠下拉部分 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
              <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
              <el-dropdown-item command="MyBlog" :icon="EditPen">我的博客</el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>乐思赋能平台 ©2025 Created by lsbc</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
    &__logo {
      height: 120px;
      background: url('@/assets/logoai.png') no-repeat center / 250px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
