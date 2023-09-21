<template>
    <!-- 折线图容器 -->
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'lineChart',
    mounted() {
        // 初始化echarts实例
        let lineCharts = echarts.init(this.$refs.charts);
        // 配置数据
        lineCharts.setOption({
            xAxis: {
                show: false,     //隐藏x轴
                type: 'category'  //'category' 类目轴，适用于离散的类目数据。为该类型时类目数据可自动从 series.data 或 dataset.source 中取，或者可通过 xAxis.data 设置类目数据。
            },
            yAxis: {
                show: false,     //隐藏y轴
            },
            series: [
                {
                    type: 'line',
                    data: [3, 6, 8, 5, 6, 4, 8, 6, 2],
                    // 拐点的样式
                    itemStyle: {     //折线拐点标志的样式
                        opacity: 0,  //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                    },
                    // 线条的样式
                    lineStyle: {
                        color: 'purple',
                        width:0.5,
                    },
                    // 区域填充样式
                    areaStyle: {
                        // 设置渐变色
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0, color: 'purple' // 0% 处的颜色
                                }, 
                                {
                                    offset: 1, color: '#fff' // 100% 处的颜色
                                }
                            ],
                            global: false // 缺省为 false
                        }
                    },
                    // 曲线是否平滑
                    smooth:true
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