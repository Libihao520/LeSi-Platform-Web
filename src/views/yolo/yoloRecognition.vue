<script setup>
import { ref } from 'vue'
import { Plus, Aim, Promotion } from '@element-plus/icons-vue'
import { getModelService } from '../../api/Aigc'
import { PutPhotoService } from '../../api/yolo'
import { getPkqImage, getAnimalImage } from '@/utils/image'
import { getModelClasss } from '@/utils/ModelCls'
import { nextTick } from 'vue'

const loading = ref(false)
const imgUrl = ref('')
const uploadRef = ref()
const modelSelectKey = ref(0)
const onSelectFile = (uploadFile) => {
  // 基于 FileReader 读取图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
}
const sbTest = ref('')
const ModelClass = ref('目标监测')
const ModelClasss = getModelClasss()
const ModelName = ref('')
const ModelNames = []
//发送请求
const onUpdateAvatar = async () => {
  if (ModelName.value == '车牌识别') {
    ElMessage.error('未开放！')
    return
  }
  // 上传图片
  if (imgUrl.value) {
    loading.value = true
    const res = await PutPhotoService(imgUrl.value, ModelName.value)
    console.log(res.data)
    if (res.data.data) {
      if (ModelClass.value == '目标监测') {
        imgUrl.value = res.data.data
      } else {
        sbTest.value = res.data.data
      }
      ElMessage.success('识别成功')
    } else {
      ElMessage.error('未识别出目标')
    }
  } else {
    ElMessage.error('请先上传图片')
  }
  loading.value = false
}
function onExamples() {
  console.log(ModelName)
  if (ModelName.value == '1813709254033409') {
    imgUrl.value = getPkqImage()
  } else if(ModelName.value == '1813709254033410') {
    imgUrl.value = getAnimalImage()
  }else{
    ElMessage.error('未设置示例图片！')
  }
}

function clearImage() {
  imgUrl.value = ''
}

async function handleModelClassChange() {
  ModelNames.value = []
  const selectcondition = ref({
    pagenum: 1, //当前页
    pagesize: 99, //每页条数
    ModelCls: ModelClass.value,
    modelName: ''
  })
  const res = await getModelService(selectcondition.value)
  ModelName.value = ''
  res.data.data.forEach((item) => {
    ModelNames.value.push({ label: item.modelName, value: item.id })
  })
  // 使用 nextTick 确保 DOM 更新
  await nextTick()
  modelSelectKey.value++
}
handleModelClassChange()

function handleNameChange() {
  sbTest.value = ''
}
</script>
<template>
  <page-containel title="AI识别">
    <el-form>
      <el-form-item class="select" label="模型类型：">
        <el-select v-model="ModelClass" @change="handleModelClassChange">
          <el-option
            v-for="option in ModelClasss"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="select" label="模型名称：">
        <el-select v-model="ModelName" @change="handleNameChange" :key="modelSelectKey">
          <el-option
            v-for="option in ModelNames.value"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="sbjg" v-if="ModelClass != '目标监测'" label="识别结果：">
        <el-input
          v-model="sbTest"
          class="input"
          placeholder="现在还木有开始识别呢！"
          :suffix-icon="Calendar"
        />
      </el-form-item>
    </el-form>
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      class="avatar-uploader"
      :show-file-list="false"
      :on-change="onSelectFile"
    >
      <el-icon v-if="!imgUrl" class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <!-- 当图片存在时，使用缩略图形式显示 -->
    <div class="image-container">
      <el-image
        style="width: 300px; height: 300px"
        v-if="imgUrl"
        :src="imgUrl"
        :zoom-rate="1.2"
        :max-scale="7"
        :min-scale="0.2"
        :preview-src-list="[imgUrl]"
        :initial-index="0"
        fit="cover"
      />
      <span v-if="imgUrl" class="close-btn" @click="clearImage">×</span>
    </div>
    <br />
    <el-button
      @click="uploadRef.$el.querySelector('input').click()"
      type="primary"
      :icon="Plus"
      size="large"
      >选择图片</el-button
    >
    <el-button @click="onExamples" type="primary" :icon="Promotion" size="large">示例</el-button>
    <el-button @click="onUpdateAvatar" type="success" :icon="Aim" size="large" v-loading="loading"
      >开始识别</el-button
    >
  </page-containel>
</template>
<style lang="scss" scoped>
.image-container {
  position: relative;
  display: inline-block;

  .close-btn {
    position: absolute;
    top: 0;
    right: 0;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    line-height: 1;

    &:hover {
      background-color: rgba(0, 0, 0, 0.7); // 鼠标悬停时改变背景色
    }
  }
}
.sbjg {
  .input {
    width: 208px;
  }
}
.select {
  width: 300px;
}
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
