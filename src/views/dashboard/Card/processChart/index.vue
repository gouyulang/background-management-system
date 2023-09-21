<template>
    <!-- 进度条容器 -->
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'processChart',
    mounted() {
        // 初始化echarts实例
        let processCharts = echarts.init(this.$refs.charts);
        // 配置数据
        processCharts.setOption({
            xAxis: {
                show: false,     //隐藏x轴
                // 最小值与最大值设置，也就是在下面设置data:[78]后,柱状图就会占据最大值100份中的78份。
                min:0,
                max:100,
            },
            yAxis: {
                show: false,     //隐藏y轴
                // 关键点：在yAxis上设置type: 'category',柱状图就会被放在y轴上、
                type: 'category'
            },
            series: [
                {
                    type: 'bar',
                    data: [78],
                    color:'green',
                    // 柱状图宽度
                    barWidth:12,
                    // 是否显示柱条的背景色
                    showBackground:true,
                    // 设置每一个柱条的背景样
                    backgroundStyle:{
                        color:'#eee'
                    },
                    // 文本
                    label:{
                        show:true,
                        color:'green',
                        // 标签内容格式器
                        formatter:'|',
                        // 标签的位置
                        position:'right',
                    }

                }
            ],
            // 布局格式
            grid: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
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