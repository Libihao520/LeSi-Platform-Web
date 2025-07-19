<script setup>
import { Check, FullScreen, User, ZoomIn } from '@element-plus/icons-vue'

import { CardModel } from './CardModel'
defineProps({
  info: CardModel
})
</script>
<template>
  <div class="card">
    <div class="left">
      <User v-if="info?.Icon == 'User'" />
      <ZoomIn v-if="info?.Icon == 'ZoomIn'" />
      <FullScreen v-if="info?.Icon == 'FullScreen'" />
      <Check v-if="info?.Icon == 'Check'" />
    </div>
    <div class="right">
      <div>
        <span>{{ info?.Title }}</span>
      </div>
      <div>
        <span>{{ info?.Count }}</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card {
  height: 50px;
  line-height: 25px;
}

.left {
  width: 50px;
  height: 50px;
  float: left;

  .el-icon {
    font-size: 50px;
  }
}

.right {
  width: 100px;
  height: 50px;
  float: right;
}
</style>
