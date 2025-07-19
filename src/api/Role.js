import request from '@/utils/request'
//获取用户角色列表
export const getUserRoleService = (data) =>
  request.post('/RoleManagement/GetUserRole', data)
//添加用户角色列表
export const putUserRoleService = (data) =>
  request.put('/RoleManagement/PutUserRole', data)

export const DeletedService = (id) =>
  request.delete('/RoleManagement/Deleted', { params: { id } })

// 下载用户导入模板  
export const downloadUserImportTemplateService = () => {
  return request.get('/RoleManagement/downloadExcelTemplate', {
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

// 批量导入
export const uploadUserFileService = (file, additionalData = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  for (const [key, value] of Object.entries(additionalData)) {
    formData.append(key, value);
  }
  return request.post('/RoleManagement/UploadUserFile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

//批量导出
export const DownloadExcelUsersFromExcelService = () => {
  return request.get('/RoleManagement/DownloadExcelUsersFromExcel', {
    responseType: 'blob' // 告诉axios我们期望服务器返回一个blob对象  
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '用户数据.xlsx'); // 设置下载文件名  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  });
};