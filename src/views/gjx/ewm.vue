<script setup>
import { ref } from 'vue'
import { getGjxEwmService } from '../../api/gjx'

const txt = ref('')
const img = ref('')
const onButton = async () => {
  if (txt.value !== '') {
    const res = await getGjxEwmService(txt.value)
    console.log(res.data)
    if (res.data.data) {
      img.value = res.data.data.result
      console.log(img.value)
    }
  } else {
    ElMessage.error('请先先输入二维码的文本内容')
  }
}
</script>

<template>
  <div class="wbtxt">
    <el-text type="primary"
      >根据您输入的内容生成二维码，如输入的是URL，当二维码被扫描时会跳转到你填入的URL</el-text
    >
  </div>
  <el-input
    class="input"
    v-model="txt"
    placeholder="请输入二维码的文本内容！"
    clearable
  />
  <br />
  <el-button class="button" @click="onButton" type="primary" plain
    >提交</el-button
  >
  <!-- 图片 -->
  <div class="demo-image">
    <el-image style="width: 500px; height: 500px" :src="img" />
  </div>
</template>
<style lang="scss" scoped>
.wbtxt {
  margin-bottom: 20px !important;
}
.input {
  width: 220px;
  margin-bottom: 20px;
}
.button {
  margin-bottom: 20px;
}
</style>
