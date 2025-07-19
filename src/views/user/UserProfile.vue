<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { formatTime } from '@/utils/format.js'
import { getUserRoleService } from '@/api/Role.js'

const formRef = ref()
const loading = ref(false)
// 是在使用仓库中数据的初始值 (无需响应式) 解构无问题
const {
  user: { id, name, createDate },
  getUser
} = useUserStore()

const form = ref({
  id,
  name,
  createDate,
  email:''
})
//请求体

const selectcondition = ref({
  pagenum: 0,
  pagesize: 0, 
  id: form.value.id,
  username: ''
})
const GetUserParticulars = async () => {
  loading.value = true
  const res = await getUserRoleService(selectcondition.value)
  form.value.email = res.data.data.email
  console.log(res.data.data)
  loading.value = false
}
GetUserParticulars()
const rules = ref({
  name: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}/,
      message: '昵称长度在2-10个非空字符',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: ['blur', 'change']
    }
  ]
})

const submitForm = async () => {
  // 等待校验结果
  await formRef.value.validate()
  // 提交修改
  //   await userUpdateInfoService(form.value)
  // 通知 user 模块，进行数据的更新
  getUser()
  // 提示用户
  ElMessage.success('修改成功')
}
</script>
<template>
  <page-containel title="基本资料">
    <!-- 表单部分 -->
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="用户昵称:" prop="name">
        <el-input v-model="form.name" class="inputcss"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱:" prop="email">
        <el-input v-model="form.email" class="inputcss"></el-input>
      </el-form-item>
      <el-form-item label="创建时间:">
        <span class="read-only-date"> {{ formatTime(form.createDate) }}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
      </el-form-item>
    </el-form>
  </page-containel>
</template>
<style lang="scss" scoped>
.inputcss {
  width: 220px;
}
</style>