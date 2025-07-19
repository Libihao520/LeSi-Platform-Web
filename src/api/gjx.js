import request from '@/utils/request'

//获取二维码二维码
export const getGjxEwmService = (txt) =>
  request.get('/gjx/ewm', { params: { txt } })
