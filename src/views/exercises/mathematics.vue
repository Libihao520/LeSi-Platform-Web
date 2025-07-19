<script setup>
import { ref, watch } from 'vue'
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

import { getTestPapers, postSubmitExercises } from '../../api/exercises'
import { useRoute } from 'vue-router'
import { getSubjectsOrFileLabel } from '../../api/exercises'

const loading = ref(false)
const singleChoice = ref([])
const multipleChoice = ref([])
const trueFalse = ref([])
const answers = ref([]) // 单选题答案
const multipleAnswers = ref([]) // 多选题答案（数组形式，存储选中的所有选项）
const trueFalseAnswers = ref([]) // 判断题答案（true 或 false）
const route = useRoute()
const FileLabels = ref([])
const TestPapersManageId = ref()
const Title = ref()

//获取试卷
const getFileLabel = async () => {
  const subjectName = route.params.subjectName
  FileLabels.value = []
  const res = await getSubjectsOrFileLabel({ subjectName: subjectName })
  res.data.data.forEach((item) => {
    FileLabels.value.push({ label: item.label, value: item.value })
  })
  Title.value = route.params.subjectName + '-' + res.data.data[0].label
  fetchQuestions(res.data.data[0].value)
}
getFileLabel()
// 异步方法获取题目
async function fetchQuestions(fileLabelId) {
  loading.value = true
  TestPapersManageId.value = fileLabelId
  const questions = await getTestPapers({ Id: fileLabelId })
  singleChoice.value = questions.data.data.singleChoice.map((question) => ({
    id: question.id,
    title: question.title,
    options: question.options,
    topicNumber: question.topicNumber
  }))
  multipleChoice.value = questions.data.data.multipleChoice.map((question) => ({
    id: question.id,
    title: question.title,
    options: question.options,
    topicNumber: question.topicNumber
  }))
  trueFalse.value = questions.data.data.trueFalse.map((question) => ({
    id: question.id,
    title: question.title,
    topicNumber: question.topicNumber
  }))

  // 初始化答案对象，使用题目ID作为键
  const singleChoiceAnswers = {}
  singleChoice.value.forEach((q) => {
    singleChoiceAnswers[q.id] = null
  })
  answers.value = singleChoiceAnswers

  const multipleChoiceAnswers = {}
  multipleChoice.value.forEach((q) => {
    multipleChoiceAnswers[q.id] = []
  })
  multipleAnswers.value = multipleChoiceAnswers

  const trueFalseChoiceAnswers = {}
  trueFalse.value.forEach((q) => {
    trueFalseChoiceAnswers[q.id] = null
  })
  trueFalseAnswers.value = trueFalseChoiceAnswers
  loading.value = false
}

// 检查是否有未回答的题目
function hasUnansweredQuestions() {
  // 检查单选题
  const hasUnansweredSingleChoice = Object.values(answers.value).includes(null)

  // 检查多选题
  const hasUnansweredMultipleChoice = Object.values(multipleAnswers.value).some(
    (answersArray) => answersArray.length === 0
  )

  //检查判断题
  const hasMissingTrueFalseAnswer = Object.keys(trueFalseAnswers.value).some(
    (key) => trueFalseAnswers.value[key] == null
  )

  // 返回是否有任何未回答的题目
  return hasUnansweredSingleChoice || hasUnansweredMultipleChoice || hasMissingTrueFalseAnswer
}
// 提交答案的方法
async function submit() {
  if (hasUnansweredQuestions()) {
    ElMessage({
      message: '请仔细检查，确保所有题目都已回答！',
      type: 'warning'
    })

    return
  }

  const questions = await postSubmitExercises({
    TestPapersManageId: TestPapersManageId.value,
    singleChoice: answers.value,
    multipleChoice: multipleAnswers.value,
    trueFalseChoice: trueFalseAnswers.value
  })
  ElMessageBox.alert(questions.data.data, '提示', { confirmButtonText: '明白' })
}

// 使用watch监听路由参数subjectName的变化
watch(
  () => route.params.subjectName,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      // 当subjectName变化时，重新调用getFileLabel获取对应试卷，并清空题库
      getFileLabel()
    }
  }
)
const SelectFileLabel = (FileLabel) => {
  Title.value = route.params.subjectName + '-' + FileLabel.label
  fetchQuestions(FileLabel.value)
}
</script>  
<template>
  <page-containel :title="Title">
    <el-container v-loading="loading">
      <el-alert
        title="注意：本网页包含单选题、多选题和判断题，在完成答题后点击提交按钮！"
        type="warning"
      />
      <el-form-item title="111">
        请选择卷名：
        <div v-for="FileLabel in FileLabels" :key="FileLabel.value">
          <el-button type="info" plain @click="SelectFileLabel(FileLabel)">{{
            FileLabel.label
          }}</el-button>
        </div>
      </el-form-item>
      <h2>单选题</h2>
      <div v-for="question in singleChoice" :key="question.id">
        <p>{{ question.topicNumber + '. ' + question.title }}</p>
        <el-radio-group v-model="answers[question.id]">
          <el-radio
            v-for="(option, optionIndex) in question.options"
            :key="optionIndex"
            :label="optionIndex"
            >{{ option }}</el-radio
          >
        </el-radio-group>
      </div>

      <!-- 多选题部分 -->
      <div v-if="multipleChoice.length">
        <h2>多选题</h2>
        <div v-for="question in multipleChoice" :key="question.id">
          <p>{{ question.topicNumber + '. ' + question.title }}</p>
          <el-checkbox-group v-model="multipleAnswers[question.id]">
            <el-checkbox
              v-for="(option, optionIndex) in question.options"
              :key="optionIndex"
              :label="optionIndex"
              >{{ option }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </div>

      <!-- 判断题部分 -->
      <div v-if="trueFalse.length">
        <h2>判断题</h2>
        <div v-for="question in trueFalse" :key="question.id">
          <p>{{ question.topicNumber + '. ' + question.title }}</p>
          <el-radio-group v-model="trueFalseAnswers[question.id]">
            <el-radio label="true">正确</el-radio>
            <el-radio label="false">错误</el-radio>
          </el-radio-group>
        </div>
      </div>
      <el-footer class="custom-footer">
        <el-button class="custom-button" type="primary" @click="submit">提交</el-button>
      </el-footer>
    </el-container>
  </page-containel>
</template>

<style lang="scss" scoped>
.custom-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.custom-button {
  padding: 15px 30px;
  font-size: 18px;
}
</style>