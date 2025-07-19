<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import {
  getUserRoleService,
  DeletedService,
  downloadUserImportTemplateService,
  DownloadExcelUsersFromExcelService,
  uploadUserFileService
} from '../../api/Role'
import { Edit, Delete } from '@element-plus/icons-vue'
import { formatTime } from '@/utils/format.js'
import UserRoleManagementEdit from './UserRoleManagementEdit.vue'

//表单数据
const channelList = ref([])
const total = ref(0) //总条数

//请求体
const selectcondition = ref({
  pagenum: 1, //当前页
  pagesize: 5, //每页条数
  username: ''
})
//转菊花
const loading = ref(false)

//抽屉
const RoleManagementEditRef = ref()

//添加逻辑（不传值）
const onAddTblist = () => {
  RoleManagementEditRef.value.open({})
}
//编辑逻辑(传值抽屉)
const onEditChannel = (row) => {
  RoleManagementEditRef.value.open(row)
}
//添加或者编辑成功回调
const onSuccess = (type) => {
  getUserRoleList()
}

//删除逻辑
const onDelChannel = async (row, $index) => {
  console.log(row.id)
  const res = await DeletedService(row.id)
  getUserRoleList()
}

//下载导入模板
const downloadExcelTemplate = () => {
  downloadUserImportTemplateService()
}

//批量导入用户
const fileInput = ref(null)
const triggerFileInput = () => {
  fileInput.value.click()
}
const handleFileChange = async (event) => {
  const file = event.target.files[0] // 获取用户选择的第一个文件
  if (file) {
    try {
      const response = await uploadUserFileService(file, {
      })
      ElMessage.success( response.data.data)
    } catch (error) {
      console.error('上传失败', error)
    } finally {
      fileInput.value.value = ''
      getUserRoleList()
    }
  } else {
    this.$message.error('请选择文件')
  }
}

//批量导出用户
const downloadExcelUser = () => {
  DownloadExcelUsersFromExcelService()
}

//重置搜索框
const Resetsearchbox = () => {
  selectcondition.value.username = ''
  getUserRoleList()
}

//处理分页逻辑
const onSizeChange = (size) => {
  selectcondition.value.pagenum = 1
  selectcondition.value.pagesize = size
  getUserRoleList()
}
//页码
const onCurrentChange = (page) => {
  selectcondition.value.pagenum = page
  getUserRoleList()
}

const getUserRoleList = async () => {
  loading.value = true
  const res = await getUserRoleService(selectcondition.value)
  channelList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getUserRoleList()
</script>
<template>
  <page-containel title="用户角色管理">
    <el-form inline>
      <el-form-item label="用户名称:">
        <el-input placeholder="请输入用户名称" v-model="selectcondition.username"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getUserRoleList">搜索</el-button>
        <el-button @click="Resetsearchbox">重置</el-button>
      </el-form-item>
    </el-form>
    <template #extra>
      <el-button type="primary" @click="onAddTblist">添加用户</el-button>
      <el-button type="success" @click="downloadExcelTemplate">下载导入模板</el-button>
      <el-button type="warning" @click="triggerFileInput">批量导入用户</el-button>
      <el-button type="info" @click="downloadExcelUser">批量导出用户</el-button>
      <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" />
    </template>
    <!-- 表单数据 -->
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="name" label="用户名称"></el-table-column>
      <el-table-column prop="role" label="用户角色"></el-table-column>
      <el-table-column prop="createDate" label="时间">
        <template #default="{ row }">
          {{ formatTime(row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row, $index)"
          ></el-button>

          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页部分 -->
    <el-pagination
      v-model:current-page="selectcondition.pagenum"
      v-model:page-size="selectcondition.pagesize"
      :page-sizes="[5, 10, 15, 20]"
      :background="true"
      layout="jumper,total, sizes, prev, pager, next "
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
  </page-containel>
  <!-- 添加编辑抽屉 -->
  <User-role-Management-Edit
    ref="RoleManagementEditRef"
    @success="onSuccess"
  ></User-role-Management-Edit>
</template>
<style lang="scss" scoped>
.select {
  width: 200px;
}
</style>