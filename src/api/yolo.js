import request from '@/utils/request'

//获取pkq表单数据
export const GetPkqTbService = (params) => request.get('/yolo/yolopkq', { params })

//上传照片识别
export const PutPhotoService = (photo, ModelId) => {
  return request.put('/yolo/PutPhoto', { photo, ModelId })
}

//皮卡丘表单手动添加
//data需要一个formData格式的对象
export const PubListPkqTbService = (data) =>
  request.put('/yolo/PutDataTb', data)

//获取图片，基于id
export const getPkqEditTbService = (id) =>
  request.get('/yolo/GetPkqEditTb', { params: { id } })

// TODO  皮卡丘表单编辑，要传id

//yolo数据大屏获取数据
export const getYoloSjdpService = () => request.get('/yolo/Getsjdp')

//删除
export const DeletedService = (id) =>
  request.delete('/yolo/Deleted', { params: { id } })