<template>
  <page-containel>
    <template #extra>
      <div
        class="stream-switch-container"
        style="display: flex; align-items: center"
      >
        <span style="margin-right: 6px">流式返回：</span>
        <el-switch
          v-model="startStream"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
        <span style="margin-left: 24px; margin-right: 6px">选择模型：</span>
        <el-select v-model="currentModel" style="width: 150px" size="small">
          <el-option label="Spark-Max" value="Spark-Max" />
          <el-option label="DeepSeek-V3" value="DeepSeek-V3" />
          <el-option label="DeepSeek-R1" value="DeepSeek-R1" />
        </el-select>
        <el-button
          type="danger"
          size="small"
          @click="clearChatHistory"
          style="margin-left: 36px"
          >清理历史</el-button
        >
      </div>
    </template>
    <div id="app">
      <el-container style="height: 80%">
        <!-- 标题栏 -->
        <el-header>
          <div class="header-content">
            与
            <template v-if="currentModel === 'Spark-Max'">
              讯飞星火Spark Max
            </template>
            <template v-else-if="currentModel === 'DeepSeek-V3'">
              DeepSeek-V3
            </template>
            <template v-else-if="currentModel === 'DeepSeek-R1'">
              DeepSeek-R1
            </template>
            对话窗口
          </div>
        </el-header>
        <!-- 主体内容区，包含对话记录和输入框 -->
        <el-main>
          <div class="chat-history-wrapper" ref="chatHistoryWrapper">
            <div
              class="chat-history"
              v-for="(message, index) in chatMessages"
              :key="index"
            >
              <div
                :class="
                  message.role === 'user' ? 'user-message' : 'gpt-message'
                "
              >
                <el-avatar :src="gpt" v-if="message.role === 'gpt'" />
                <div
                  :class="
                    message.role === 'user' ? 'user-content' : 'gpt-content'
                  "
                >
                  <!-- <span class="message-role">{{ message.role }}</span> -->
                  <span
                    class="message-content"
                    v-html="renderMarkdown(message.content, message.role)"
                  ></span>
                </div>
                <div class="avatar-container" v-if="message.role === 'user'">
                  <el-avatar :src="userStore.user.photo || avatar" />
                </div>
              </div>
            </div>
          </div>
          <el-row class="input-row" style="margin-top: 15px">
            <el-input
              v-model="newMessage"
              placeholder="请输入消息"
              clearable
              @keyup.enter="sendMessage"
              style="width: 80%"
              :disabled="isSending"
            />

            <el-button type="primary" @click="sendMessage" :disabled="isSending"
              >发送</el-button
            >
          </el-row>
        </el-main>
      </el-container>
    </div>
  </page-containel>
</template>

<script setup>
import { ref, nextTick, reactive } from 'vue'
import {
  QuestionsAndAnswers,
  QuestionsAndAnswersStream,
  GetHistory,
  DelHistory
} from '../../api/Aigc'
import { useUserStore } from '@/stores'
import { onMounted } from 'vue'
import gpt from '@/assets/gpt.png'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css' // 选择你喜欢的样式

// 配置 marked 使用 highlight.js 进行代码高亮
marked.setOptions({
  highlight: function (code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
    return hljs.highlight(validLanguage, code).value
  },
  breaks: true // 将单行换行符转换为 <br> 标签
})

// 定义响应式数据
const chatMessages = ref([]) // 存储对话消息
const newMessage = ref('') // 输入框绑定的新消息
const chatHistoryWrapper = ref(null) // 用于滚动操作的 DOM 引用
const userStore = useUserStore()
const startStream = ref(true)
const isSending = ref(false)
const currentModel = ref('Spark-Max')

// 清理对话历史的方法
const clearChatHistory = async () => {
  chatMessages.value = []
  DelHistory()
}
//获取对话历史的方法
const getChatHistory = async () => {
  chatMessages.value = []
  var res = await GetHistory()
  chatMessages.value = res.data.data
}

onMounted(() => {
  getChatHistory()
  userStore.getUser()
})

// 渲染 Markdown 内容
const renderMarkdown = (content, role) => {
  if (role === 'gpt') {
    return marked(content)
  } else {
    return content // 用户消息直接返回原始内容
  }
}

// 定义方法
const sendMessage = async () => {
  if (isSending.value) return
  if (newMessage.value.trim() === '') return

  isSending.value = true

  // 添加用户消息
  chatMessages.value.push({
    role: 'user',
    content: newMessage.value
  })

  // 清空输入框
  const userMessage = newMessage.value

  if (startStream.value === false) {
    //非流式
    const res = await QuestionsAndAnswers(newMessage.value, currentModel.value)
    chatMessages.value.push({
      role: 'gpt',
      content: res.data.data
    })
    // 滚动到底部
    nextTick(() => {
      if (chatHistoryWrapper.value) {
        chatHistoryWrapper.value.scrollTop =
          chatHistoryWrapper.value.scrollHeight
      }
    })
    isSending.value = false
    console.log(chatMessages.value)
  } else {
    // 流式处理
    const gptMessage = reactive({ role: 'gpt', content: '' })
    chatMessages.value.push(gptMessage)

    // 创建消息处理队列
    const messageQueue = []
    let isProcessingQueue = false

    // 异步字符处理函数
    const processQueue = async () => {
      if (isProcessingQueue || messageQueue.length === 0) return
      isProcessingQueue = true

      while (messageQueue.length > 0) {
        const currentText = messageQueue.shift()
        for (const char of currentText) {
          gptMessage.content += char

          // 添加微小延迟保证UI更新
          await new Promise((resolve) => setTimeout(resolve, 30))
          // 滚动到底部
          nextTick(() => {
            chatHistoryWrapper.value.scrollTop =
              chatHistoryWrapper.value.scrollHeight
          })
        }
      }
      isProcessingQueue = false
    }

    // 发送 SSE 请求
    QuestionsAndAnswersStream(
      userMessage,
      (data, done) => {
        // 假设 data 是字符串，done 是布尔值，done=true 表示流式结束
        if (data) {
          const originalMessage = data.replace(/\\n/g, '\n')
          messageQueue.push(originalMessage)
          processQueue()
        }
        if (done) {
          // 等待队列全部处理完再解除禁用
          const waitQueue = async () => {
            while (isProcessingQueue || messageQueue.length > 0) {
              await new Promise((resolve) => setTimeout(resolve, 50))
            }
            isSending.value = false
          }
          waitQueue()
        }
      },
      currentModel.value
    )
  }
  newMessage.value = ''
}
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
}

.el-header {
  background-color: #409eff;
  color: white;
  text-align: center;
  line-height: 50px;
}

.chat-history-wrapper {
  height: calc(80vh - 240px);
  overflow-y: auto;
}

.chat-history {
  margin-bottom: 10px;
}

.user-message {
  display: flex;
  justify-content: flex-end;
  /* 用户消息靠右 */
}

.gpt-message {
  display: flex;
  justify-content: flex-start;
  /* 系统消息靠左 */
}

.user-content {
  background-color: #409eff;
  color: white;
  padding: 10px;
  border-radius: 10px;
  display: inline-block;
  max-width: 70%;
  text-align: left;
  /* 用户消息内容左对齐 */
}

.gpt-content {
  background-color: #f0f0f0;
  color: black;
  padding: 10px;
  border-radius: 10px;
  display: inline-block;
  max-width: 70%;
  text-align: left;
  /* 系统消息内容左对齐 */
}

.message-role {
  font-weight: bold;
  margin-right: 5px;
}

.input-row {
  justify-content: center;
  align-items: center;
}
</style>
