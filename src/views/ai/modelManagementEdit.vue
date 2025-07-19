<script setup>
import { ref, toRaw } from 'vue'
import { PutModelService } from '../../api/Aigc'
import { encrypt } from '@/utils/util'
import { getModelClasss } from '@/utils/ModelCls'
const loading = ref(false)
//控制抽屉显示隐藏
const visibleDrawer = ref(false)
//抽屉是添加还是编辑
const isAdd = ref(true)
// 用于存储上传的文件
const uploadedFile = ref(null)
const upload = ref(null)
//模型类型选项
const ModelClasss = getModelClasss()
//默认表单数据
const defaultForm = {
  ModelCls: '目标监测',
  modelName: ''
}
//准备数据
const formModel = ref({
  ...defaultForm
})
const uploadKey = ref(0)
// 父类点击抽屉时传row到这里
const open = async (row) => {
  visibleDrawer.value = true
  //手动重置数据
  formModel.value = {
    ...defaultForm
  }
  isAdd.value = true
  uploadKey.value += 1 // 改变 key 以强制重渲染
  uploadedFile.value = null // 重置上传的文件
  upload.value = null
}

// 监听文件上传
const handleFileChange = (file) => {
  loading.value = true
  uploadedFile.value = file.raw
  loading.value = false
  console.log(file.raw.size)
}
//表单提交
const emit = defineEmits(['sucess'])
const onSave = async (state) => {
  loading.value = true
  if (state == '取消') {
    visibleDrawer.value = false
  } else {
    if (!formModel.value.modelName) {
      ElMessage.error('请输入模型名称')
      return
    }
    const file = uploadedFile.value
    if (file) {
      // 检查文件后缀是否为.onnx
      const fileExtension = file.name.split('.').pop().toLowerCase()
      if (fileExtension !== 'onnx') {
        ElMessage.error('请上传一个.onnx模型文件')
        loading.value = false
        return
      }
      try {
        const response = await PutModelService(file, {
          ModelCls: formModel.value.ModelCls,
          modelName: formModel.value.modelName
        })
        ElMessage.success('上传成功')
        visibleDrawer.value = false
        // 回调
        emit('success', 'add')
      } catch (error) {
        ElMessage.error('上传失败')
      } finally {
        loading.value = false
      }
    } else {
      ElMessage.error('请上传文件')
      loading.value = false
    }
  }
}
defineExpose({
  open
})
</script>
<template>
  <el-drawer v-model="visibleDrawer" :title="isAdd ? '新增' : '编辑'" direction="rtl" size="50%">
    <el-form :model="formModel.value" ref="formRef" label-width="100px" v-loading="loading">
      <el-form-item label="模型类型:">
        <el-select class="inputcss" v-model="formModel.ModelCls">
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
          class="inputcss"
          v-model="formModel.modelName"
          placeholder="请输入模型名称！"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-upload
          :key="uploadKey"
          ref="upload"
          class="upload-demo"
          :on-change="handleFileChange"
          :limit="1"
          :auto-upload="false"
        >
          <template #trigger>
            <el-button type="primary">点击上传文件</el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip text-red">
              限制上传一个onnx模型文件，新文件将覆盖旧文件。
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSave('已保存')" type="primary">{{
          isAdd ? '提交' : '保存'
        }}</el-button>
        <el-button @click="onSave('取消')" type="info">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>


<style lang="scss" scoped>
.inputcss {
  width: 220px;
}

.selectcss {
  width: 320px;
}
</style>
