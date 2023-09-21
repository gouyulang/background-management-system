<template>
    <!-- 柱状图容器 -->
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'barChart',
    mounted() {
        // 初始化echarts实例
        let barCharts = echarts.init(this.$refs.charts);
        // 配置数据
        barCharts.setOption({
            xAxis: {
                show: false,     //隐藏x轴
                type: 'category'  //'category' 类目轴，用于将数据分配合理化
            },
            yAxis: {
                show: false,     //隐藏y轴
            },
            series: [
                {
                    type: 'bar',
                    data: [3, 10, 25, 19, 16, 24,22,16,10,9,7,4],
                }
            ],
            // 布局格式
            grid: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,

            },
            // 提示框
            tooltip:{
                show:true,
            }
        })
    },

};
</script>

<style lang="scss" scoped>
.charts {
    width: 100%;
    height: 100%;
}
</style>