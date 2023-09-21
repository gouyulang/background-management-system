<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="12">
                <!-- 左侧搜索组件 -->
                <Search></Search>
            </el-col>
            <el-col :span="12">
                <!-- 右侧类别组件 -->
                <Category></Category>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Search from './Search/index.vue';
import Category from './Category/index.vue';
export default {
    name: 'Observe',
    components:{
        Search,
        Category
    }

};
</script>

<style lang="scss" scoped>

</style>