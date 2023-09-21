<template>
    <div>
        <!-- form表单组件 -->
        <!-- inline   代表行内表单（一行可以放多个表单元素） -->
        <el-form :inline="true" class="demo-form-inline" :model="cForm" :disabled="isShow">
            <el-form-item label="一级分类">
                <!-- 子标签:value获取一级分类的id，父标签利用v-model收集这个id到cForm中  -->
                <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1">
                    <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in list1" :key="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2">
                    <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in list2" :key="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3">
                    <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in list3" :key="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'CategorySelect',
    props:['isShow'],
    data(){
        return {
            // 一级分类的数据
            list1:[],
            // 二级分类的数据
            list2:[],
            // 三级分类的数据
            list3:[],
            // 收集相应的一级二级三级分类的id
            cForm:{
                category1Id:'',
                category2Id:'',
                category3Id:'',
            }
        }
    },

    mounted() {
        // 组件挂载完毕，需要相服务器发请求，获取相应的一级分类的数据
        this.getCategory1List();
    },

    methods: {
        // 获取一级分类数据的方法
        async getCategory1List(){
            // 发请求
            let result=await this.$API.attr.reqCategory1List();
            // console.log(result);
            if(result.code==200){
                this.list1=result.data;
            }
        },

        // 获取二级分类数据的方法----一级分类的select事件回调。（当一级分类的opion发送变化时获取相应二级分类的数据）
        async handler1(){
            // 清除上一次选择的二级分类和三级分类数据与id
            this.list2=[];
            this.list3=[];
            this.cForm.category2Id='';
            this.cForm.category3Id='';

            // 解构出一级分类的id
            const {category1Id}=this.cForm;
            // 通过一级分类的id发请求，获取二级分类数据
            let result=await this.$API.attr.reqCategory2List(category1Id);
            // console.log(result);
            if(result.code==200){
                this.list2=result.data;
            }
        },

        // 获取三级分类数据的方法----二级分类的select事件回调。（当二级分类的opion发送变化时获取相应三级分类的数据）
        async handler2(){
            // 清除上一次选择的三级分类数据与id
            this.list3=[];
            this.cForm.category3Id='';

            // 解构出一级分类的id
            const {category2Id}=this.cForm;
            // 通过一级分类的id发请求，获取二级分类数据
            let result=await this.$API.attr.reqCategory3List(category2Id);
            // console.log(result);
            if(result.code==200){
                this.list3=result.data;
            }
        },

        // 三级分类的select事件回调。（当三级分类的opion发送变化时触发该回调）
        async handler3(){
            // 触发自定义事件，传递数据
            this.$emit('getCategoryId', this.cForm);
        },
    },

};
</script>

<style lang="scss" scoped></style>