<template>
    <!-- 柱状图容器 -->
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts';
import { mapState } from 'vuex';
export default {
    name: 'SaleBarChart',
    computed: {
        ...mapState({
            list: state => state.home.list
        })
    },
    // 监听属性
    watch: {
        list() {
            // 初始化echarts实例
            let barCharts = echarts.init(this.$refs.charts);
            // 配置数据
            barCharts.setOption({
                title: {
                    text: '销售额趋势'
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
                        data: this.list.orderFullYearAxis,
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
                        data: this.list.orderFullYear
                    }
                ]
            })
        }
    },
    mounted() {
        // 初始化echarts实例
        let barCharts = echarts.init(this.$refs.charts);
        // 配置数据
        barCharts.setOption({
            title: {
                text: '销售额趋势'
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
                    data: this.list.orderFullYearAxis,
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
                    data: this.list.orderFullYear
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