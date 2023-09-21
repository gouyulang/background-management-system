<template>
    <div>
        <el-card>
            <!-- 头部 -->
            <div slot="header" class="header">
                <div class="search-header">
                    <span>线上热门搜索</span>
                    <!-- dropdown下拉菜单 -->
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <!-- 三个点图标 -->
                            <i class="el-icon-more"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>黄金糕</el-dropdown-item>
                            <el-dropdown-item>狮子头</el-dropdown-item>
                            <el-dropdown-item>螺蛳粉</el-dropdown-item>
                            <el-dropdown-item>双皮奶</el-dropdown-item>
                            <el-dropdown-item>蚵仔煎</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <!-- 中间 -->
            <div class="search-middle">
                <el-row :gutter="5">
                    <el-col :span="12">
                        <!-- 折线图组件 -->
                        <lineChart></lineChart>
                    </el-col>
                    <el-col :span="12">
                        <!-- 折线图组件 -->
                        <lineChart></lineChart>
                    </el-col>
                </el-row>
                <!-- 表格 -->
                <el-table :data="tableData" style="width: 100%" border>
                    <el-table-column label="排名" width="180" type="index">
                    </el-table-column>
                    <el-table-column label="搜索关键字" width="180">
                    </el-table-column>
                    <!-- sortable	对应列是否可以排序， -->
                    <el-table-column label="用户数" sortable>
                    </el-table-column>
                    <el-table-column label="周涨幅" sortable>
                    </el-table-column>
                </el-table>
                <!-- 分页器 -->
                <el-pagination layout="prev, pager, next" :total="100" class="pagination">
                </el-pagination>
            </div>
            <!-- 底部 -->
            <div class="search-footer">
            </div>
        </el-card>
    </div>
</template>

<script>
import lineChart from './lineChart/index.vue';
export default {
    name: 'Search',
    data() {
        return {
            tableData: [{}],
        }
    },
    components: {
        lineChart
    }

};
</script>

<style scoped>
.search-header {
    display: flex;
    justify-content: space-between;
}
.header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}
.pagination {
    float: right;
}
</style>