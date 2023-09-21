<template>
    <a :title="title" style="margin: 10px;">
        <el-button v-bind="$attrs" v-on="$listeners"></el-button>
    </a>
</template>

<script>
// 具有鼠标提示功能的按钮组件
export default {
    name: 'HintButton',
    props:['title']
};
</script>

<style lang="scss" scoped>

</style>