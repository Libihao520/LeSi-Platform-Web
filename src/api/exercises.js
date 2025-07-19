import request from '@/utils/request'

//获取数学题目
export const getTestPapers = (params) => request.get('/Exercises/GetTestPapers',{params})

//提交
export const postSubmitExercises = (data) =>
  request.post('/Exercises/Submit', data)

//成绩中心
export const GetAchievementCenter = (params) => request.get('/Exercises/GetAchievementCenter', { params })

//删除
export const DeletedService = (id) =>
  request.delete('/Exercises/Deleted', { params: { id } })


//导出用户作答情况
export const DownloadWordService = (id) => {
  return request.get('/Exercises/DownloadWord', {
    params: { id },
    responseType: 'blob'
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '用户作答情况.docx'); // 设置下载文件名  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  });
};

//获取题库
export const getTestPaperManage = (params) => request.get('/Exercises/GetTestPaperManage', { params })

export const addTestPaperManage = (file, additionalData = {}) => {
  const formData = new FormData();
  formData.append('File', file);
  for (const [key, value] of Object.entries(additionalData)) {
    formData.append(key, value);
  }
  return request.post('/Exercises/AddTestPaperManage', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

//获取科目或卷
export const getSubjectsOrFileLabel = (params) => request.get('/Exercises/GetSubjectsOrFileLabel', { params })

// 下载题库导入模板  
export const downloadUserImportTemplateService = () => {
  return request.get('/Exercises/downloadExcelTemplate', {
    responseType: 'blob' // 告诉axios我们期望服务器返回一个blob对象  
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '导入模板.xlsx'); // 设置下载文件名  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  });
};

//开启作答
export const ChangeHasAnsweringStartedService = (id) =>
  request.get('/Exercises/ChangeHasAnsweringStarted', { params: { id } })