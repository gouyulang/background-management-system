<template>
    <div>
        <div class="header">
            <span class="search-header">搜索用户数</span>
            <!-- 右侧图标 -->
            <svg t="1695038891456" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="2528" width="16" height="16">
                <path
                    d="M169.984 169.984C-19.456 358.4-19.456 665.6 169.984 854.016s495.616 189.44 684.032 0 189.44-495.616 0-684.032-495.616-189.44-684.032 0z m606.208 606.208c-146.432 146.432-384 146.432-530.432 0S99.328 392.192 245.76 245.76s384-146.432 530.432 0c147.456 147.456 147.456 385.024 0 530.432zM456.704 306.176c0-40.96 33.792-73.728 74.752-73.728S605.184 266.24 604.16 307.2c0 40.96-33.792 74.752-73.728 73.728-40.96-1.024-74.752-34.816-73.728-74.752z m179.2 423.936c-2.048 6.144-6.144 13.312-10.24 17.408-26.624 27.648-59.392 43.008-97.28 44.032-18.432 0-35.84 0-54.272-3.072-29.696-4.096-67.584-40.96-61.44-79.872l12.288-79.872 24.576-138.24c0-3.072 1.024-6.144 1.024-9.216 0-19.456-6.144-26.624-25.6-28.672-8.192-1.024-16.384-2.048-24.576-4.096-9.216-3.072-13.312-11.264-13.312-18.432 1.024-8.192 6.144-13.312 16.384-15.36 5.12-1.024 11.264-1.024 16.384-1.024h139.264c17.408 0 27.648 8.192 27.648 25.6 0 14.336-2.048 28.672-5.12 43.008-9.216 53.248-19.456 105.472-28.672 158.72-3.072 17.408-7.168 34.816-9.216 52.224-1.024 8.192 0 17.408 2.048 25.6 3.072 11.264 11.264 17.408 22.528 15.36 9.216-1.024 18.432-4.096 27.648-8.192 7.168-3.072 13.312-8.192 20.48-10.24 13.312-5.12 22.528 3.072 19.456 14.336z"
                    fill="#BABABA" p-id="2529"></path>
            </svg>
        </div>
        <div class="main">
            <span class="main-title">12321</span>
            <span class="main-content">17.1</span>
            <!-- 上升图标 -->
            <svg t="1695114067213" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="9685" width="16" height="16">
                <path
                    d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"
                    fill="#d81e06" p-id="9686"></path>
            </svg>
            <!-- 下降图标 -->
            <svg t="1695114090227" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="10751" width="16" height="16">
                <path
                    d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
                    fill="#1afa29" p-id="10752"></path>
            </svg>
        </div>
        <div class="footer">
            <!-- 折线图 -->
            <div class="charts" ref="charts"></div>
        </div>
    </div>
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
                        color: '#409EFF',
                        width: 2,
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
                                    offset: 0, color: '#409EFF' // 0% 处的颜色
                                },
                                {
                                    offset: 1, color: '#fff' // 100% 处的颜色
                                }
                            ],
                            global: false // 缺省为 false
                        }
                    },
                    // 曲线是否平滑
                    smooth: true
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
            tooltip: {
                show: true,
            }
        })
    },
};
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    color: #a09f9f;
    ;
}

.search-header {
    margin-right: 20px;
}

.main {
    margin: 10px 0px;
}

.main-title {
    margin-right: 30px;
}

.main-content {
    margin-right: 10px;
}

.charts {
    width: 100%;
    height: 50px;
}</style>