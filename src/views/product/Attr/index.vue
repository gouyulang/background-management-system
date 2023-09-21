<template>
    <div>
        <el-card style="margin: 20px 0px;">
            <CategorySelect @getCategoryId="getCategoryId" :isShow="!isShowTable"></CategorySelect>
        </el-card>
        <el-card>
            <!-- 属性列表页面 -->
            <div v-show="isShowTable">
                <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">
                    添加属性
                </el-button>
                <!-- 表格-展示品牌属性 -->
                <!--data    表格组件将来需要展示的数据--数组格式 
                    border  添加边框-->
                <el-table style="width:100%" :data="attrList" border>
                    <!-- 每一列 -->
                    <!-- column属性： -->
                    <!--label	显示的标题
                        width	对应列的宽度
                        align	对齐方式left/center/right
                        type	对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮
                        prop	对应列内容的字段名，也可以使用 property 属性
                        注意1：element-ui当中的table组件，展示的数据是以列为展示数据
                    -->
                    <el-table-column type="index" label="序号" width="80px" align="center">
                    </el-table-column>

                    <el-table-column prop="attrName" label="属性名称" width="150px" align="center">
                    </el-table-column>

                    <el-table-column prop="prop" label="属性值列表" width="width">
                        <!-- 作用域插槽 -->
                        <!-- row 是数组attrList中的每一项  $index为索引值-->
                        <template slot-scope="{row,$index}">
                            <!-- {{ $index }}-------{{ row }} -->
                            <el-tag 
                                type="success" 
                                v-for="(attrValue, index) in row.attrValueList" 
                                :key="attrValue.id"
                                style="margin: 0px 20px;"
                            >
                                {{ attrValue.valueName }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column prop="prop" label="操作" width="150px">
                        <!-- 作用域插槽 -->
                        <!-- row 是数组attrList中的每一项  $index为索引值-->
                        <template slot-scope="{row,$index}">
                            <!-- {{ $index }}-------{{ row }} -->
                            <!-- size="mini" 表示将图标缩小 -->
                            <!-- 修改属性按钮 -->
                            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
                            <!-- 删除属性按钮 -->
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 添加属性/修改属性页面结构 -->
            <div v-show="!isShowTable">
                <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
                    <el-form-item label="属性名">
                        <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>
                </el-form>

                <el-button type="primary" icon="el-icon-plus" @click="addAttrValue()"
                    :disabled="!attrInfo.attrName">添加属性值</el-button>
                <el-button @click="isShowTable = true">取消</el-button>

                <el-table border style="width: 100%;margin: 20px 0px;" :data="attrInfo.attrValueList">
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="prop" label="属性值名称" width="width">
                        <!-- 作用域插槽 -->
                        <template slot-scope="{row,$index}">
                            <!-- {{ $index }}----{{ row }} -->
                            <!-- 添加属性中的 查看模式与编辑模式 切换  本质：在input标签和span标签之间进行切换。 -->
                            <el-input 
                                placeholder="请输入属性值名称" 
                                v-model="row.valueName" 
                                size="mini" 
                                v-if="row.flag"
                                @blur="toLook(row)" 
                                @keyup.native.enter="toLook(row)" 
                                :ref="$index"
                            >
                            </el-input>
                            <span v-else @click="toEdit(row, $index)" style="display: block;">{{ row.valueName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <!-- 作用域插槽 -->
                        <template slot-scope="{row,$index}">
                            <!-- {{ $index }}----{{ row }} -->
                            <!-- element-ui组件：气泡确认框 -->
                            <!-- confirm/onConfirm	点击确认按钮时触发	— -->
                            <!-- cancel/onCancel	点击取消按钮时触发 -->
                            <el-popconfirm :title="`你确定要删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>

                <el-button type="primary" :disabled="attrInfo.attrValueList.length<1" @click="addOrUpdateAttr">保存</el-button>
                <el-button @click="isShowTable = true">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
// 按需引入lodash的深拷贝方法
import cloneDeep from 'lodash/cloneDeep';

export default {
    name: 'Attr',
    data() {
        return {
            // 全部一级，二级，三级分类的id
            category1Id: '',
            category2Id: '',
            category3Id: '',
            // 接收品牌属性的字段
            attrList: [],
            // 是否显示属性列表以及控制三级联动的可操作状态
            isShowTable: true,
            // 收集新增/修改属性与属性值数据的字段
            attrInfo: {
                "attrName": "",     //属性名
                "attrValueList": [        //属性值列表--数组格式
                    // 一开始不应该有数据
                    // { 
                    //     "attrId": 0,            //属性值的id
                    //     "valueName": ""    //属性值的名字
                    // },
                ],
                "categoryId": 0,       //三级分类的id
                "categoryLevel": 3,    //因为服务器需要区分几级id
            },

        }
    },

    methods: {
        // 获取全部一级，二级三级分类的id--自定义事件
        getCategoryId(categoryId) {
            // 解构对象，获取全部一级，二级，三级分类的id
            const { category1Id, category2Id, category3Id } = categoryId;
            // console.log(category1Id,category2Id,category3Id);
            this.category1Id = category1Id;
            this.category2Id = category2Id;
            this.category3Id = category3Id;

            // 发请求获取品牌属性
            this.getAttrList();
        },

        // 封装发请求获取品牌属性的方法 
        async getAttrList() {
            // 解构对象，获取全部一级，二级，三级分类的id
            const { category1Id, category2Id, category3Id } = this;
            // 发请求
            let result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id);
            // console.log(result);
            if (result.code == 200) {
                this.attrList = result.data;
            }
        },

        // 添加属性值的方法
        addAttrValue() {
            // 向属性值数组里面添加属性值对象
            this.attrInfo.attrValueList.push({
                //对于修改某个属性时，可以在已有的属性值基础上新增新的属性值（新增新的属性值的时候，需要把已有的属性的id带上）
                attrId: this.attrInfo.id,
                valueName: '',
                // flag标记属性，控制添加属性中的 查看模式与编辑模式 切换。
                flag: true,
            })
            // 当前flag属性，是响应式数据（数据变化视图跟着变化）

            // 点击添加属性值时，新的输入框同样自动聚焦。
            this.$nextTick(() => {
                this.$refs[this.attrInfo.attrValueList.length - 1].focus();
            });
        },

        // 添加属性按钮的方法
        addAttr() {
            // 切换table显示与隐藏
            this.isShowTable = false;
            // 清除上一次的数据
            this.attrInfo = {
                "attrName": "",     //属性名
                "attrValueList": [],    //属性值列表
                "categoryId": this.category3Id,       //三级分类的id
                "categoryLevel": 3,     //因为服务器需要区分几级id
            }
        },

        // 修改属性按钮的方法
        updateAttr(row) {
            // console.log(row);
            // 切换table显示与隐藏
            this.isShowTable = false;

            // 将选中的属性赋值给attrInfo
            // this.attrInfo=row;
            // 由于数据内部还有对象，所以浅拷贝已经无法解决。因此选择深拷贝解决这类问题。
            // 自带安装的lodash就封装了深拷贝的方法，因此直接引入使用
            this.attrInfo = cloneDeep(row);

            // 在修改某一个属性的时候，将相应的属性值元素添加上flag标记
            this.attrInfo.attrValueList.forEach(item => {
                // 这样做虽然可以给属性值添加上flag标记，但是视图却不会跟着变化。因为flag不是响应式数据。
                // 因为 Vue 无法探测普通的新增 property。这样新增的属性并非响应式数据。
                // item.flag=false;   //错误
                // es5新增vm.$set()---向属性值对象新增一个响应式属性
                this.$set(item, 'flag', false);
            });
        },

        // 失去焦点的事件--切换为查看模式
        toLook(row) {
            // row是当前用户添加的最新的属性值
            // console.log(row);
            // 一些注意事项：
            //（1）属性值输入不能为空字符串。
            if (row.valueName.trim() == '') {
                this.$message('属性值不能为空，请重新输入！');
                return;
            }
            // （2）属性值不能重复---some()方法用于检测数组中的元素是否满足指定条件，即查找数组中是否有满足条件的元素
            let isRepeat = this.attrInfo.attrValueList.some(item => {
                // 判断最新的属性值和除自己之外其他属性值是否会重复
                if (row != item) {
                    return row.valueName == item.valueName;
                }
            });
            if (isRepeat) return;
            // 切换为查看模式
            row.flag = false;
        },

        // 点击span的回调--切换为编辑模式
        toEdit(row, index) {
            row.flag = true;
            // 获取input节点，实现自动聚焦。
            // 需要注意：点击span的时候，切换为input编辑模式，对于浏览器来说，实现重绘是需要时间的。因此我们不可能一点击span就立马获取到input节点。
            // 解决：this.$nextTick(回调函数)。在下一次 DOM 更新结束后执行其指定的回调。
            this.$nextTick(() => {
                this.$refs[index].focus();
            });
        },

        // 删除属性值的回调
        deleteAttrValue(index){
            // index是属性值数组中要被删除的属性值的索引
            // 当前删除属性值的操作是不需要发请求的。
            // splice 是数组的一个方法。用于删除原数组的某一个或几个连续的数字
            this.attrInfo.attrValueList.splice(index,1);   //1表示只删除1个数
        },

        // 保存按钮--进行添加或修改属性与属性值的方法
        async addOrUpdateAttr(){
            // 整理参数：（1）属性值不能为空，（2）服务器不需要flag字段。
            // filter()方法直接创建一个新的数组，新数组的元素是通过检查指定数组中符合条件的所有元素组成，主要用于筛选数组。！！！！
            this.attrInfo.attrValueList=this.attrInfo.attrValueList.filter(item=>{
                // 过滤掉属性值为空的
                if(item.valueName!=''){
                    // 删除掉falg字段
                    delete item.flag;
                    return true;
                }
            })
            // 发送请求
            try {
                await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
                // 切换table显示与隐藏
                this.isShowTable = true;
                this.$message({type:'success',message:'保存成功'});
                // 保存成功以后，需要再次获取品牌属性进行展示
                this.getAttrList();
            } catch (error) {
                this.$message({type:'danger',message:'保存失败'});
            }
            
        }
    }


};
</script>

<style lang="scss" scoped></style>