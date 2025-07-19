<script setup>
import { ref } from 'vue'
import { getModelService, DelModelService } from '../../api/Aigc'
import { Edit, Delete } from '@element-plus/icons-vue'
import { formatTime } from '@/utils/format.js'
import modelManagementEdit from './modelManagementEdit.vue'
import { getModelClasss } from '@/utils/ModelCls'

const channelList = ref([])
const total = ref(0) //总条数
const selectcondition = ref({
  pagenum: 1, //当前页
  pagesize: 5, //每页条数
  ModelCls: '全部',
  modelName: ''
})
//转菊花
const loading = ref(false)
//获取文章列表
const getTableList = async () => {
  loading.value = true
  const res = await getModelService(selectcondition.value)
  channelList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getTableList()
const modelManagementEditRef = ref()

//添加逻辑
const onAddTblist = () => {
  modelManagementEditRef.value.open({})
}
//编辑逻辑
const onEditChannel = (row) => {
  modelManagementEditRef.value.open(row)
}
//删除逻辑
const onDelChannel = async (row, $index) => {
  const res = await DelModelService(row.id)
  getTableList()
}
//重置搜索框
const Resetsearchbox = () => {
  selectcondition.value.ModelCls = '全部'
  selectcondition.value.modelName = ''
}

//添加或者编辑成功回调
const onSuccess = (type) => {
  if (type === 'add') {
    //TODO渲染最后一页
    getTableList()
  } else {
    //编辑直接渲染当前页
    getTableList()
  }
}

//处理分页逻辑
//每页条数
const onSizeChange = (size) => {
  selectcondition.value.pagenum = 1
  selectcondition.value.pagesize = size
  getTableList()
}
//页码
const onCurrentChange = (page) => {
  selectcondition.value.pagenum = page
  getTableList()
}
const ModelClasss = getModelClasss()
</script>
<template>
  <page-containel title="模型管理"
    ><el-form inline>
      <!-- 类别 -->
      <el-form-item label="模型类型：">
        <el-select class="select" v-model="selectcondition.ModelCls">
          <el-option
            v-for="option in ModelClasss"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="模型名称:">
        <el-input
          v-model="selectcondition.modelName"
          style="width: 240px"
          placeholder="请输入模型名称！"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableList">搜索</el-button>
        <el-button @click="Resetsearchbox">重置</el-button>
        <el-button type="primary" @click="onAddTblist">上传模型</el-button>
      </el-form-item>
    </el-form>

    <!-- 表单数据 -->
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="modelCls" label="模型类型"></el-table-column>
      <el-table-column prop="modelName" label="模型名称"></el-table-column>
      <el-table-column prop="modelSize" label="模型大小(MB)"></el-table-column>
      <el-table-column prop="path" label="模型地址"></el-table-column>
      <el-table-column prop="createDate" label="上传时间">
        <template #default="{ row }">
          {{ formatTime(row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="createName" label="上传人"></el-table-column>
      <el-table-column label="操作" width="150">
        <!-- row就是channelList的一项，$index是下标 -->
        <template #default="{ row, $index }">
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
    <!-- 添加编辑抽屉 -->
    <!-- //success监听 -->
    <modelManagement-edit ref="modelManagementEditRef" @success="onSuccess"></modelManagement-edit>
  </page-containel>
</template>
<style lang="scss" scoped>
.select {
  width: 200px;
}
</style>
