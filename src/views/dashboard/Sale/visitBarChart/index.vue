<template>
    <!-- 柱状图容器 -->
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts';
import { mapState } from 'vuex';
export default {
    name: 'VisitBarChart',
    computed:{
        ...mapState({
            list:state=>state.home.list
        })
    },
    mounted() {
        // 初始化echarts实例
        let barCharts = echarts.init(this.$refs.charts);
        // 配置数据
        barCharts.setOption({
            title:{
                text:'访问量趋势'
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
                    data: this.list.userFullYearAxis,
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
                    data: this.list.userFullYear
                }
            ]
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