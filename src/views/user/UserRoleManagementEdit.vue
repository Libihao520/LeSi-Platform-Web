<script setup>
import { ref, toRaw } from 'vue'
import { getUserRoleService, putUserRoleService } from '../../api/Role'
import { genderOptions } from '@/config/RoleManagementConfig.js'
import { encrypt } from '@/utils/util'
const loading = ref(false)
//控制抽屉显示隐藏
const visibleDrawer = ref(false)
//抽屉是添加还是编辑
const isAdd = ref(true)

//默认表单数据
const defaultForm = {
  id: null,
  name: ''
}

//请求体
const selectcondition = ref({
  pagenum: 0,
  pagesize: 0, 
  id: '',
  username: ''
})
//准备数据
const formModel = ref({
  ...defaultForm
})

// 父类点击抽屉时传row到这里
const open = async (row) => {
  visibleDrawer.value = true
  //手动重置数据
  formModel.value = {
    ...defaultForm
  }
  //如果id存在发请求获取对应数据，进行回显
  if (row.id) {
    loading.value = true
    isAdd.value = false
    selectcondition.value.id = row.id
    const res = await getUserRoleService(selectcondition.value)
    formModel.value = res.data.data
    loading.value = false
    console.log(formModel.value)
  } else {
    isAdd.value = true
  }
}
//表单提交
const emit = defineEmits(['sucess'])
const onSave = async (state) => {
  const putFrom = ref({})
  putFrom.value = JSON.parse(JSON.stringify(formModel.value))
  putFrom.value.passWord = encrypt(formModel.value.passWord)
  putFrom.value.email = encrypt(formModel.value.email)

  if (state == '取消') {
    visibleDrawer.value = false
  } else {
    //有id是编辑操作
    if (formModel.value.id) {
      await putUserRoleService(putFrom.value)
      visibleDrawer.value = false
      // 回调
      emit('success', 'upd')
    } else {
      await putUserRoleService(putFrom.value)
      visibleDrawer.value = false
      // 回调
      emit('success', 'add')
    }
  }
  console.log(state)
}
defineExpose({
  open
})
</script>
<template>
  <el-drawer v-model="visibleDrawer" :title="isAdd ? '新增' : '编辑'" direction="rtl" size="50%">
    <el-form :model="formModel.value" ref="formRef" label-width="100px" v-loading="loading">
      <el-form-item label="姓名:" prop="title">
        <el-input class="inputcss" v-model="formModel.name" placeholder="请输入用户姓名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱:" prop="title">
        <el-input class="inputcss" v-model="formModel.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="title">
        <el-input class="inputcss" v-model="formModel.passWord" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item class="selectcss" label="角色:" prop="role">
        <el-select v-model="formModel.role" placeholder="请选择角色">
          <el-option
            v-for="item in genderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSave('已保存')" type="primary">{{
          isAdd ? '提交' : '保存'
        }}</el-button>
        <el-button @click="onSave('取消')" type="info">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>


<style lang="scss" scoped>
.inputcss {
  width: 220px;
}

.selectcss {
  width: 320px;
}
</style>
