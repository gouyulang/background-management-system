<template>
    <div>
        <el-card>
            <!-- 头部 -->
            <div class="header">
                <div class="category-header">
                    <span>销售额类别占比</span>
                    <!-- 单选按钮 -->
                    <el-radio-group v-model="value">
                        <el-radio-button label="全部渠道"></el-radio-button>
                        <el-radio-button label="线上"></el-radio-button>
                        <el-radio-button label="门店"></el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <!-- 饼图 -->
            <div class="charts" ref="charts"></div>
        </el-card>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'Category',
    data() {
        return {
            value: '全部渠道'
        }
    },
    mounted() {
        const myCharts = echarts.init(this.$refs.charts);
        myCharts.setOption({
            title:{
                text:'商品广告',
                subtext:'广告',
                // 将标题移到中央
                left:'center',
                top:'center',
                textStyle:{
                    fontSize:'14px'
                }
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        position: 'outside'
                    },
                    labelLine: {
                        show: true
                    },
                    data: [
                        { value: 300, name: '视频广告：300' },
                        { value: 1048, name: '搜索引擎：1048'},
                        { value: 735, name: '直接访问：735' },
                        { value: 580, name: '邮箱营销：580' },
                        { value: 484, name: '联盟广告：484' }
                    ]
                }
            ]
        });
        // 绑定事件
        myCharts.on('mouseover',(params)=>{
            // console.log(params.data);   //即为图表各部分内容的名称
            const {name,value}=params.data;
            // 重新设置标题
            myCharts.setOption({
                title:{
                    text:name,
                    subtext:value,
                }
            })
        })
    },

};
</script>

<style scoped>
.category-header {
    /* 两边贴边，再平分剩余空间 */
    display: flex;
    justify-content: space-between;
    /* 垂直居中 */
    align-items: center;
}

.header {
    border-bottom: 1px solid #eee;
}

.charts {
    widows: 100%;
    height: 250px;
}
</style>