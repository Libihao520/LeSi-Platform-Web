<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { PutUserAvatarService } from '../../api/user'
import { Plus, Upload } from '@element-plus/icons-vue'

const loading = ref(false)
const isFirstLoad = ref(true)
const formRef = ref()
const uploadRef = ref()

const {
  user: { photo },
  getUser
} = useUserStore()
const imgUrl = ref(photo)

const onUploadFile = (uploadFile) => {
  const maxSize = 5 * 1024 * 1024
  if (uploadFile.raw.size > maxSize) {
    ElMessage.error('上传的图片大小不能超过5M，请重新选择')
    return
  }
  const reader = new FileReader()
  // imgUrl = ref('')
  // 图片转base64
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    // 基于 FileReader 读取图片做预览
    imgUrl.value = reader.result
  }
}
// 上传图片，更新头像
const onUpdateAvatar = async () => {
  if (imgUrl.value) {
    loading.value = true
    try {
      const res = await PutUserAvatarService(imgUrl.value)
      if (res.data.data) {
        ElMessage.success(res.data.data)
      }
      getUser()
    } catch (error) {
      ElMessage.error('操作出现错误，请稍后再试')
    } finally {
      loading.value = false
    }
  } else {
    ElMessage.error('请先上传图片')
  }
}
function clearImage() {
  imgUrl.value = ''
}
</script>
<template>
  <page-containel title="头像设置">
    <div class="mx-1">
      <el-text type="primary" size="large">当前头像：</el-text>
    </div>
    <div>
      <el-upload
        ref="uploadRef"
        class="avatar-uploader"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="onUploadFile"
      >
        <!-- <img v-if="imgUrl" :src="imgUrl" class="avatar" /> -->
        <el-icon v-if="!imgUrl" class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </div>
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
    <div>
      <el-button
        class="but"
        @click="uploadRef.$el.querySelector('input').click()"
        type="primary"
        :icon="Plus"
        size="large"
        >选择头像
      </el-button>
      <el-button
        @click="onUpdateAvatar"
        type="success"
        :icon="Upload"
        size="large"
        v-loading="loading"
        >提交更改</el-button
      >
    </div>
  </page-containel>
</template>

<style lang="scss" scoped>
.image-container {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
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
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
</style>
