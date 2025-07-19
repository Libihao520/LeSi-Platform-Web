<script lang="ts" setup>
import * as echarts from 'echarts'
//页面加载完成后加载我们的图标
import { onMounted } from 'vue'
onMounted(async () => {
    var chartDom = document.getElementById('echarsMain-Histogram');
    var myChart = echarts.init(chartDom as HTMLElement);
    myChart.resize({
        width: 700,
        height: 400
    });
    //属性 option
    const option = {
        title: {
            text: '成绩分布',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['<10', '10-30', '30-60', '60-80', '>80', '100'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Direct',
                type: 'bar',
                barWidth: '60%',
                data: [3, 7, 8, 2, 1, 2, 7]
            }
        ]
    };
    //绘制图标
    myChart.setOption(option)
})
</script>
<template>
    <div id="echarsMain-Histogram"></div>
</template>