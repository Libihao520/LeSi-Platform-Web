import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    }, //登录页
    {
      path: '/',
      //架子
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/sjdp/yolosjdp',
      children: [
        {
          path: '/sjdp/yolosjdp',
          component: () => import('@/views/sjdp/yoloSjdp.vue')
        },
        {
          path: '/yolo/yolocar',
          component: () => import('@/views/yolo/yoloCar.vue')
        },
        {
          path: '/yolo/yolopkq',
          component: () => import('@/views/yolo/yoloPkq.vue')
        },
        {
          path: '/yolo/yolorecognition',
          component: () => import('@/views/yolo/yoloRecognition.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/MyBlog',
          component: () => import('@/views/user/MyBlog.vue')
        },
        {
          path: '/user/RoleManagement',
          component: () => import('@/views/user/UserRoleManagement.vue')
        },
        {
          path: '/gjx/ewm',
          component: () => import('@/views/gjx/ewm.vue')
        },
        // 做题
        {
          path: '/exercises/mathematics/:subjectName',
          component: () => import('@/views/exercises/mathematics.vue')
        },
        {
          path: '/exercises/testPapersManage',
          component: () => import('@/views/exercises/testPapersManage.vue')
        },
        {
          path: '/exercises/AchievementCenter',
          component: () => import('@/views/exercises/AchievementCenter.vue')
        },
        {
          path: '/ai/dhck',
          component: () => import('@/views/ai/dhck.vue')
        },
        {
          path: '/ai/modelManagement',
          component: () => import('@/views/ai/modelManagement.vue')
        },
      ]
    }
  ]
})
//访问拦截
router.beforeEach((to) => {
  //如果没有token，且访问的是非登录页，拦截到登录，其他情况正常放行
  const useStroe = useUserStore()
  if (!useStroe.token && to.path !== '/login') return '/login'
  return true
})
export default router
