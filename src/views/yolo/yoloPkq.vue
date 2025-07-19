<script setup>
import { ref } from 'vue'
import { GetPkqTbService, DeletedService } from '../../api/yolo'
import { Edit, Delete } from '@element-plus/icons-vue'
import { formatTime } from '@/utils/format.js'
import yoloEdit from './yoloEdit.vue'
import { getModelClasss } from '@/utils/ModelCls'

const channelList = ref([])
const total = ref(0) //总条数
const selectcondition = ref({
  pagenum: 1, //当前页
  pagesize: 5, //每页条数
  ModelCls: '全部',
  ModelName:'',
  isaudit: '0'
})
const ModelClasss = getModelClasss()
//转菊花
const loading = ref(false)
//获取文章列表
const getPkqtbList = async () => {
  loading.value = true
  const res = await GetPkqTbService(selectcondition.value)
  channelList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getPkqtbList()
const yoloEditRef = ref()

//添加逻辑
const onAddTblist = () => {
  yoloEditRef.value.open({})
}
//编辑逻辑
const onEditChannel = (row) => {
  console.log(row)
  yoloEditRef.value.open(row)
}
//删除逻辑
const onDelChannel = async (row, $index) => {
  console.log(row.id)
  const res = await DeletedService(row.id)
  getPkqtbList()
}
//重置搜索框
const Resetsearchbox = () => {
  selectcondition.value.ModelCls = '全部'
  selectcondition.value.ModelName = ''
  selectcondition.value.isaudit = '0'
}

//添加或者编辑成功回调
const onSuccess = (type) => {
  if (type === 'add') {
    //TODO渲染最后一页
    getPkqtbList()
  } else {
    //编辑直接渲染当前页
    getPkqtbList()
  }
}

//处理分页逻辑
//每页条数
const onSizeChange = (size) => {
  selectcondition.value.pagenum = 1
  selectcondition.value.pagesize = size
  getPkqtbList()
}
//页码
const onCurrentChange = (page) => {
  selectcondition.value.pagenum = page
  getPkqtbList()
}
</script>
<template>
  <page-containel title="识别详情"
    ><el-form inline>
      <!-- 类别 -->
      <el-form-item label="模型类型：">
        <el-select class="select" v-model="selectcondition.ModelCls">
          <el-option label="全部" value="全部"></el-option>
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
        class="select"
          v-model="selectcondition.ModelName"
          style="width: 240px"
          placeholder="请输入模型名称！"
          clearable
        />
      </el-form-item>
      <!-- 是否审核 -->
      <el-form-item label="审核情况:">
        <el-select class="select" v-model="selectcondition.isaudit">
          <el-option label="全部" value="0"></el-option>
          <el-option label="已审核" value="1"></el-option>
          <el-option label="未审核" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPkqtbList">搜索</el-button>
        <el-button @click="Resetsearchbox">重置</el-button>
      </el-form-item>
    </el-form>
    <template #extra><el-button type="primary" @click="onAddTblist">人工新增</el-button></template>
    <!-- 表单数据 -->
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cls" label="模型类型"></el-table-column>
      <el-table-column prop="name" label="模型名称"></el-table-column>
      <el-table-column prop="sbjgCount" label="数量"></el-table-column>
      <el-table-column prop="sbJg" label="识别结果"></el-table-column>
      <el-table-column prop="createDate" label="创建时间">
        <template #default="{ row }">
          {{ formatTime(row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="isManualReview" label="审核">
        <template #default="{ row }">
          {{ row.isManualReview == true ? '已审核' : '未审核' }}</template
        >
      </el-table-column>
      <el-table-column prop="createName" label="创建人"></el-table-column>
      <el-table-column label="操作" width="150">
        <!-- row就是channelList的一项，$index是下标 -->
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
    <!-- 添加编辑抽屉 -->
    <!-- //success监听 -->
    <yolo-edit ref="yoloEditRef" @success="onSuccess"></yolo-edit>
  </page-containel>
</template>
<style lang="scss" scoped>
.select {
  width: 200px;
}
</style>
