<script lang="ts" setup>
import { ref } from 'vue'
import CardCom from './components/CardCom.vue'
import Pie from './components/Pie.vue'
import Histogram from './components/Histogram.vue'
import Line from './components/Line.vue'
import { getYoloSjdpService } from '../../api/yolo'

const list = ref([
  {
    Title: '注册用户',
    Icon: 'User',
    Count: 0
  },
  {
    Title: '识别次数',
    Icon: 'ZoomIn',
    Count: 0
  },
  {
    Title: '目标数量',
    Icon: 'FullScreen',
    Count: 0
  },
  {
    Title: '有效数量',
    Icon: 'Check',
    Count: 0
  }
])
const getSjdpDate = async () => {
  const res = await getYoloSjdpService()
  console.log(res.data.data)
  list.value = [
    { Title: '注册用户', Icon: 'User', Count: res.data.data.userCount },
    { Title: '识别次数', Icon: 'ZoomIn', Count: res.data.data.sbcsCount },
    {
      Title: '目标数量',
      Icon: 'FullScreen',
      Count: res.data.data.mbslCount
    },
    { Title: '有效数量', Icon: 'Check', Count: res.data.data.yxslCount }
  ]
}
getSjdpDate()
</script>
<template>
  <div class="cardContent">
    <el-card class="box-card" v-for="item in list" :key="item.Title">
      <CardCom :info="item"></CardCom>
    </el-card>
    <el-card class="left">
      <!-- 饼图 -->
      <Pie></Pie>
    </el-card>
    <el-card class="right">
      <!-- 柱状图 -->
      <Histogram></Histogram>
    </el-card>
    <el-card class="lineCard">
      <!-- 折线图 -->
      <Line></Line>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.cardContent {
  width: 100%;
  margin: 0px auto;

  .box-card {
    float: left;
    width: 24%;
    margin-right: 5px;
    margin-bottom: 20px;
  }

  .left,
  .right {
    float: left;
    width: 48%;
    margin-bottom: 20px;
  }

  .lineCard {
    width: 97.5%;
  }

  .right {
    margin-left: 20px;
  }
}
</style>
