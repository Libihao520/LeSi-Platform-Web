<script setup>
import { ref } from 'vue'
import {
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElButton,
  ElRadioGroup,
  ElRadio,
  ElMessage
} from 'element-plus'
import { Download, Delete } from '@element-plus/icons-vue'
import { GetAchievementCenter, DeletedService, DownloadWordService } from '../../api/exercises'
import { formatTime } from '@/utils/format.js'
const channelList = ref([])
const loading = ref(false)
const total = ref(0) //总条数
const selectcondition = ref({
  pagenum: 1, //当前页
  pagesize: 5 //每页条数
})

//数据初始化
async function fetchQuestions() {
  loading.value = true
  const res = await GetAchievementCenter(selectcondition.value)
  console.log(res.data.data)
  channelList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}

//删除逻辑
const onDelChannel = async (row, $index) => {
  console.log(row.id)
  const res = await DeletedService(row.id)
  fetchQuestions()
}
//下载word
const onDownloadChannel = async (row, $index) => {
  const res  = await DownloadWordService(row.id)
}
//处理分页逻辑
//每页条数
const onSizeChange = (size) => {
  selectcondition.value.pagenum = 1
  selectcondition.value.pagesize = size
  fetchQuestions()
}
//页码
const onCurrentChange = (page) => {
  selectcondition.value.pagenum = page
  fetchQuestions()
}
// 组件创建时调用 fetchQuestions
fetchQuestions()
</script>  
<template>
  <page-containel title="成绩中心">
    <el-form inline> </el-form>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="subject" label="科目"> </el-table-column>
      <el-table-column prop="correctQuantity" label="答对数量"> </el-table-column>
      <el-table-column prop="numberOfQuestions" label="题目数量"> </el-table-column>
      <el-table-column prop="createName" label="答题人"> </el-table-column>
      <el-table-column prop="createDate" label="提交时间">
        <template #default="{ row }">
          {{ formatTime(row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="totalPoints" label="分数"> </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row, $index }">
          <el-button
            :icon="Download"
            circle
            plain
            type="primary"
            @click="onDownloadChannel(row, $index)"
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
</template>

