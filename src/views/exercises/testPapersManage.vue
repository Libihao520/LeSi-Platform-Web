<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { formatTime } from '@/utils/format.js'
import { getTestPaperManage, downloadUserImportTemplateService,ChangeHasAnsweringStartedService } from '../../api/exercises'
import testPapersManageEdit from './testPapersManageEdit.vue'

const channelList = ref([])
const total = ref(0) //总条数
const selectcondition = ref({
  pagenum: 1, //当前页
  pagesize: 5, //每页条数
  FileLabel: '',
  QuestionBankCourseTitle: ''
})
//转菊花
const loading = ref(false)
//获取文章列表
const getTableList = async () => {
  loading.value = true
  const res = await getTestPaperManage(selectcondition.value)
  channelList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getTableList()
const testPapersManageEditRef = ref()

//添加逻辑
const onAddTblist = () => {
  testPapersManageEditRef.value.open({})
}
//编辑逻辑
const onEditChannel = (row) => {
  console.log(row)
  testPapersManageEditRef.value.open(row)
}
//删除逻辑
const onDelChannel = async (row, $index) => {
  console.log(row.id)
  const res = await DelModelService(row.id)
  getTableList()
}

//开启关闭作答逻辑
const onChangeHasAnsweringStarted = async (row, $index) => {
  const res = await ChangeHasAnsweringStartedService(row.id)
  getTableList()
}
//重置搜索框
const Resetsearchbox = () => {
  selectcondition.value.FileLabel = ''
  selectcondition.value.QuestionBankCourseTitle = ''
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

//下载导入模板
const downloadExcelTemplate = () => {
  downloadUserImportTemplateService()
}
</script>
<template>
  <page-containel title="模型管理">
    <template #extra>
      <el-button type="success" @click="downloadExcelTemplate">下载导入模板</el-button>
      <el-button type="primary" @click="onAddTblist">批量导入题目</el-button>
    </template>
    <el-form inline>
      <el-form-item label="卷名:">
        <el-input
          v-model="selectcondition.FileLabel"
          style="width: 240px"
          placeholder="请输入卷名！"
          clearable
        />
      </el-form-item>
      <el-form-item label="科目:">
        <el-input
          v-model="selectcondition.QuestionBankCourseTitle"
          style="width: 240px"
          placeholder="请输入科目！"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableList">搜索</el-button>
        <el-button @click="Resetsearchbox">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表单数据 -->
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="fileLabel" label="卷名"></el-table-column>
      <el-table-column prop="questionBankCourseTitle" label="科目"></el-table-column>
      <el-table-column prop="hasAnsweringStarted" label="是否开启作答">
        <template #default="{ row }">
          {{ row.hasAnsweringStarted ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="上传时间">
        <template #default="{ row }">
          {{ formatTime(row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="createName" label="上传人"></el-table-column>
      <el-table-column label="操作" width="100">
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
      <el-table-column label="开启作答" width="110">
        <template #default="{ row, $index }">
          <el-switch v-model="row.hasAnsweringStarted"
          @click="onChangeHasAnsweringStarted(row, $index)"
          />
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
    <testPapersManage-edit
      ref="testPapersManageEditRef"
      @success="onSuccess"
    ></testPapersManage-edit>
  </page-containel>
</template>
<style lang="scss" scoped>
.select {
  width: 200px;
}
</style>
