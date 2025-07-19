<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { PubListPkqTbService, getPkqEditTbService } from '@/api/yolo'
import { getModelClasss } from '@/utils/ModelCls'

const loading = ref(false)
//控制抽屉显示隐藏
const visibleDrawer = ref(false)
//抽屉是添加还是编辑
const isAdd = ref(true)
const ModelClasss = getModelClasss()
//默认表单数据
const defaultForm = {
  id: null,
  cls: '',
  name: '',
  sbjgCount: 0,
  createDate: '',
  photo: '',
  isManualReview: true // TODO
}

//准备数据
const formModel = ref({
  ...defaultForm
})
//图片上传相关逻辑
const imgUrl = ref('')
const onUploadFile = (uploadFile) => {
  const reader = new FileReader()
  // 图片转base64
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    // 基于 FileReader 读取图片做预览
    imgUrl.value = reader.result
    //将上传的图片保存到formModel，后面提交
    formModel.value.photo = reader.result
  }
}
//提交
const emit = defineEmits(['sucess'])
const onSave = async (state) => {
  if (state == '取消') {
    visibleDrawer.value = false
  } else {
    const fd = new FormData()
    for (let key in formModel.value) {
      fd.append(key, formModel.value[key])
    }
    //有id是编辑操作
    if (formModel.value.id) {
      console.log('编辑保存操作')
      await PubListPkqTbService(formModel.value)
      visibleDrawer.value = false
      // 回调
      emit('success', 'upd')
    } else {
      console.log('添加保存操作')
      await PubListPkqTbService(formModel.value)
      ElMessage.success('手动添加数据成功')
      visibleDrawer.value = false
      // 回调
      emit('success', 'add')
    }
  }
}
// 父类点击抽屉时传row到这里
const open = async (row) => {
  visibleDrawer.value = true
  //手动重置数据
  formModel.value = {
    ...defaultForm
  }
  imgUrl.value = ''
  if (row.id) {
    isAdd.value = false

    //如果id存在，要发请求获取对应数据，进行回显
    loading.value = true
    const res = await getPkqEditTbService(row.id)
    loading.value = false
    formModel.value = res.data.data
    imgUrl.value = res.data.data.photo
    console.log(formModel)
  } else {
    isAdd.value = true
    formModel.value = {
      ...defaultForm
    }
  }
}

function clearImage() {
  imgUrl.value = ''
}

// 处理输入框失去焦点事件，确保 sbjgCount 是整数
function handleInputBlur() {
  // 强制将 sbjgCount 转换为整数
  formModel.value.sbjgCount = Math.floor(formModel.value.sbjgCount)
}
defineExpose({
  open
})
</script>
<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="isAdd ? '手动新增' : '编辑'"
    direction="rtl"
    size="50%"
  >
    <el-form :model="formModel" ref="formRef" label-width="100px" v-loading="loading">
      <el-form-item label="模型类型:">
        <el-select class="inputcss" v-model="formModel.cls">
          <el-option
            v-for="option in ModelClasss"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模型名称:" prop="title">
        <el-input class="inputcss" v-model="formModel.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="数量:" prop="title">
        <el-input
          type="number"
          class="inputcss"
          v-model="formModel.sbjgCount"
          placeholder="请输入数量"
          @blur="handleInputBlur"
        ></el-input>
      </el-form-item>

      <el-form-item label="审核:" prop="title">
        <!-- <el-input
          v-model="formModel.isManualReview"
          placeholder="审核状态"
        ></el-input> -->
        <el-switch
          v-model="formModel.isManualReview"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-text="已审核"
          inactive-text="未审核"
        />
      </el-form-item>

      <el-form-item label="时间:">
        <el-date-picker
          v-model="formModel.createDate"
          type="date"
          placeholder="Pick a day"
          :disabled-date="disabledDate"
          :shortcuts="shortcuts"
          :size="size"
        />
      </el-form-item>
      <!-- 图片 -->
      <el-form-item label="识别图片:" prop="photo">
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <!-- <img v-if="imgUrl" :src="imgUrl" class="avatar" /> -->
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
.inputcss {
  width: 220px;
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
