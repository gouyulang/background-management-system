<template>
    <div>
        <el-card class="box-card" style="margin: 10px 0px;">
            <!-- 头部 -->
            <div slot="header" class="clearfix">
                <!-- 头部左侧内容 -->
                <!-- Tab栏切换 -->
                <!--  @tab-click="handleClick" -->
                <!-- value/v-model	 绑定值，选中选项卡的name，值为那个name就会显示那个标签下的内容 -->
                <el-tabs class="tab" v-model="activeName">
                    <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                    <el-tab-pane label="访问量" name="visit"></el-tab-pane>
                </el-tabs>

                <!-- 头部右侧内容 -->
                <div class="right">
                    <span @click="setDay">今日</span>
                    <span @click="setWeek">本周</span>
                    <span @click="setMonth">本月</span>
                    <span @click="setYear">本年</span>
                    <!-- 日历组件 -->
                    <!-- value-format	可选，绑定值的格式。不指定则绑定值为 Date 对象 -->
                    <el-date-picker
                        v-model="date"
                        class="date"
                        type="daterange" 
                        range-separator="-" 
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        size="mini"
                        value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </div>
            </div>
            <!-- 内容区域 -->
            <div>
                <!-- gutter	栅格间隔 -->
                <el-row :gutter="10">
                    <!-- 内容区左侧图表 -->
                    <el-col :span="18">
                        <!-- 柱状图组件 -->
                        <SaleBarChart class="charts" v-if="activeName=='sale'"></SaleBarChart>
                        <VisitBarChart class="charts" v-else></VisitBarChart>
                    </el-col>
                    <!-- 内容区左侧排名  -->
                    <el-col :span="6" class="right2">
                        <!-- 排名组件 -->
                        <SaleRank v-if="activeName=='sale'"></SaleRank>
                        <VisitRank v-else></VisitRank>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>

<script>
import SaleBarChart from './saleBarChart/index.vue';
import VisitBarChart from './visitBarChart/index.vue';
import SaleRank from './saleRank/index.vue';
import VisitRank from './visitRank/index.vue';
import dayjs from 'dayjs';
export default {
    name: 'Sale',
    data(){
        return {
            activeName:'sale',
            // 收集日历的数据--数组格式
            date:[],
        }
    },
    components:{
        SaleBarChart,
        VisitBarChart,
        SaleRank,
        VisitRank,
    },

    methods: {
        // 本日
        setDay(){
            const day=dayjs().format('YYYY-MM-DD');
            this.date=[day,day];
        },
        // 本周
        setWeek(){
            // 周一
            const start=dayjs().day(1).format('YYYY-MM-DD');
            // 周天
            const end=dayjs().day(7).format('YYYY-MM-DD');
            this.date=[start,end];
        },
        // 本月
        setMonth(){
            // 月初
            const start=dayjs().startOf('month').format('YYYY-MM-DD');
            // 月底
            const end=dayjs().endOf('month').format('YYYY-MM-DD');
            this.date=[start,end];
        },
        // 本年
        setYear(){
            // 年初
            const start=dayjs().startOf('year').format('YYYY-MM-DD');
            // 年底
            const end=dayjs().endOf('year').format('YYYY-MM-DD');
            this.date=[start,end];
        }
    },

};
</script>

<style lang="scss">
// 隐藏柱状图底部边框横线
.el-card__header {
    border-bottom: none;
}
</style>
<style scoped>
.clearfix {
    position: relative;
    display: flex;
    /* 先两边贴边 再平分剩余空间（重要） */
    justify-content: space-between;
}
.tab {
    width: 100%;
}
.right {
    /* 子绝父相 */
    position: absolute;
    right: 0px;
}
.right span {
    margin: 0px 10px;
}
.date {
    width: 250px;
    margin: 0px 20px;
}
.charts {
    width: 100%;
    height: 300px;
}
</style>