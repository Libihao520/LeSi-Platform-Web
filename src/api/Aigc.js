import request from '@/utils/request'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'

//查询所有模型
export const getModelService = (params) =>
  request.get('/Aigc/GetModelService', { params })

// 创建模型
export const PutModelService = (file, additionalData = {}) => {
  const formData = new FormData()
  formData.append('Model', file)
  for (const [key, value] of Object.entries(additionalData)) {
    formData.append(key, value)
  }
  return request.post('/Aigc/PutModelService', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
//删除
export const DelModelService = (id) =>
  request.delete('/Aigc/DelModelService', { params: { id } })

export const QuestionsAndAnswers = (q, model) =>
  request.get('/Aigc/QuestionsAndAnswers', { params: { q, model } })

export const QuestionsAndAnswersStream = (q, onMessage, model) => {
  const useStore = useUserStore()
  const token = useStore.token

  // 构造完整的 API 地址，包含 token 和 model 作为查询参数
  const apiUrl = `${baseURL}/Aigc/QuestionsAndAnswersStream?q=${encodeURIComponent(q)}&token=${encodeURIComponent(token)}&model=${encodeURIComponent(model)}`

  // 创建 EventSource 实例
  const eventSource = new EventSource(apiUrl)

  eventSource.onmessage = (event) => {
    // 尝试解析消息，判断是否为结束信号
    let data = event.data
    let done = false
    try {
      // 假设服务端最后一条消息为 {"done":true}
      const parsed = JSON.parse(event.data)
      if (parsed && parsed.done) {
        done = true
        data = '' // 结束信号不传递内容
      } else if (typeof parsed.data === 'string') {
        data = parsed.data
      }
    } catch (e) {
      // 普通文本消息，忽略
    }
    onMessage(data, done)
    if (done) {
      eventSource.close()
    }
  }

  eventSource.onerror = () => {
    eventSource.close()
    // 发生错误时也通知前端流结束
    onMessage('', true)
  }

  return eventSource
}
//清楚缓存
export const DelHistory = () => request.delete('/Aigc/DelHistory')
//获取缓存
export const GetHistory = () => request.get('/Aigc/GetHistory')
