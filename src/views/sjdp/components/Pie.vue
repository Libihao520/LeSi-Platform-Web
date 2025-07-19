<script lang="ts" setup>
import * as echarts from 'echarts'
//页面加载完成后加载我们的图标
import { onMounted } from 'vue'
onMounted(async () => {
    var chartDom = document.getElementById('echarsMain-Pie');
    var myChart = echarts.init(chartDom as HTMLElement);
    myChart.resize({
        width: 800,
        height: 400
    });
    //属性 option
    const option = {
        title: {
            text: '用户画像',
            subtext: '当前系统注册用户角色',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 2, name: '超级管理员' },
                    { value: 5, name: '编辑用户' },
                    { value: 10, name: '普通用户' },
                    { value: 20, name: '教师' },
                    { value: 25, name: '学生' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    //绘制图标
    myChart.setOption(option)
})
</script>
<template>
    <div id="echarsMain-Pie"></div>
</template>