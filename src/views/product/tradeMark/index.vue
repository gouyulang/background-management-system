<template>
    <div>
        <!-- 按钮 -->
        <el-button type="primary" title="添加" icon="el-icon-plus" @click="showDialog">添加</el-button>
        <!-- 表格组件 -->
        <!-- data:表格组件将来需要展示的数据--数组格式 
            border 添加边框-->
        <el-table style="width:100%" :data="list" border>
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

            <el-table-column prop="tmName" label="品牌名称" width="width">
            </el-table-column>

            <el-table-column prop="prop" label="品牌LOGO" width="width">
                <!-- 作用域插槽 -->
                <!-- row 是数组list中的每一项  $index为索引值-->
                <template slot-scope="{row,$index}">
                    <!-- {{ $index }}----{{ row }} -->
                    <img :src="row.logoUrl" style="width: 100px;height: 100px;">
                </template>
            </el-table-column>

            <el-table-column prop="prop" label="操作" width="width">
                <!-- 作用域插槽 -->
                <template slot-scope="{row,$index}">
                    <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器    -->
        <!--四大要素：数据总条数total，当前页current-page，每页展示条数page-size，连续页码数（默认5）
            备注："prev, pager, next,->, sizes,total" ->表示右边的都要靠右放
            background	是否为分页按钮添加背景色
            layout	组件布局，子组件名用逗号分隔
            page-count	总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性	
            pager-count	页码按钮的数量，当总页数超过该值时会折叠。pager-count为7，连续页码数就为5
            size-change	改变时会触发	每页条数
            current-change	改变时会触发	当前页
            :page-sizes="[3,5,10]"    选择分页器每页最大个数，可以选择3，5，10
        -->
        <el-pagination 
            style="margin-top:20px;text-align: center;" 
            :total="total" 
            :current-page="page" 
            :page-size="limit"
            :page-sizes="[3, 5, 10]" 
            :pager-count="7" 
            @current-change="getPageList"
            @size-change="handleSizeChange"
            background 
            layout="prev, pager, next,->, sizes,total"
        >
        </el-pagination>

        <!-- 添加和修改品牌按钮--弹出对话框 -->
        <!-- :visible.sync   控制对话框显示与隐藏用的 -->
        <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
            <!-- 展示表单 -->
            <!--v-model或者:model    这个属性的作用就是把表单的数据收集到哪个对象的身上，将来表单验证也需要这个属性 -->
            <el-form style="width: 80%;" :model="tmForm" :rules="rules" ref="ruleForm">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <!-- 上传图片 -->
                    <!--action  图片要上传去的地址
                        :show-file-list   是否显示已上传文件列表
                        :on-success="handleAvatarSuccess"   文件上传成功时的钩子,当上传成功，会执行一次 
                        :before-upload="beforeAvatarUpload"   上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
                    -->
                    <!-- 上传图片收集数据，不能使用v-model，因为不是表单元素 -->
                    <el-upload 
                        class="avatar-uploader" 
                        action="/dev-api/admin/product/fileUpload" 
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess" 
                        :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

export default {
    name: 'tradeMark',
    data() {
        // 自定义校验规则
        // var checkAge = (rule, value, callback) => {
        //     if (!value) {
        //         return callback(new Error('年龄不能为空'));
        //     }
        //     setTimeout(() => {
        //         if (!Number.isInteger(value)) {
        //             callback(new Error('请输入数字值'));
        //         } else {
        //             if (value < 18) {
        //                 callback(new Error('必须年满18岁'));
        //             } else {
        //                 callback();
        //             }
        //         }
        //     }, 1000);
        // };

        return {
            page: 1,    //代表分页器第几页
            limit: 5,   //当前页展示数据条数
            total: 0,    //总共数据条数
            list: [],    //列表要展示的数据

            // 对话框
            dialogFormVisible: false,    //对话框显示与隐藏控制的属性
            tmForm: {            //收集品牌的信息
                // 里面的属性不能乱写，需要看开发文档，要和后台要求的一致。
                tmName: '',
                logoUrl: '',
            },

            // 表单验证规则
            rules: {
                // 品牌名称的验证规则
                tmName: [
                    // required   是否必须输入
                    // trigger    触发行为条件
                    // max，min   长度要求，最大和最短
                    // message    提示信息
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
                ],
                // 品牌logo的验证规则
                logoUrl: [
                    { required: true, message: '请选择品牌图片' }
                ],
                // 自定义校验规则
                // age: [
                //     // checkAge就是我们自己定义的规则
                //     { validator: checkAge, trigger: 'blur' }
                // ]
            }
        }
    },

    mounted() {
        // 组件挂载完毕要发请求获取列表数据
        // console.log(this.$API.trademark);
        this.getPageList();
    },

    methods: {
        // 获取列表数据
        async getPageList(pager = 1) {
            this.page = pager;
            // 解构参数
            const { page, limit } = this;
            // 发送请求获取数据
            let result = await this.$API.trademark.reqTradeMarkList(page, limit);
            // console.log(result);
            if (result.code == 200) {
                // 存储数据总条数和要展示的数据
                this.total = result.data.total;
                this.list = result.data.records;
            }
        },

        // 修改当前页功能-------弃用
        // handleCurrentChange(pager){
        //     // console.log(pager);    //当前页
        //     this.page=pager;
        //     // 重新发请求更新数据
        //     this.getPageList();
        // }

        // 修改分页器每页数据条数
        handleSizeChange(limit) {
            // console.log(limit);     //每页条数
            this.limit = limit;
            // 重新发送请求更新数据
            this.getPageList();
        },

        // 点击添加品牌按钮
        showDialog() {
            this.dialogFormVisible = true;  //对话框显示与隐藏控制的属性
            // 清空上一次的历史数据
            this.tmForm = { tmName: '', logoUrl: '' };
        },

        // 点击修改品牌按钮
        updateTradeMark(row) {
            // row是当前用户选择的品牌信息
            // console.log(row);
            this.dialogFormVisible = true;

            // 将已有的品牌信息赋值给tmForm展示。
            // 这里出现了一个问题：我们修改对话框内容，页面就会实时更改，因为row赋值的原因，tmForm存储的就为服务器返回的品牌信息。
            // 解决：浅拷贝 （修改tmForm不会马上改变row，修改row则会马上改变tmForm）
            // this.tmForm=row;
            this.tmForm = { ...row };
        },

        // 图片上传成功时的钩子,当上传成功，会执行一次 
        handleAvatarSuccess(res, file) {
            // res存储了反应状态码和我们上传到服务器上的图片的真实地址。
            // file则包含了更多东西，包括真实地址。
            // console.log(res,file);

            // 收集品牌图片数据，将来带给服务器发请求
            this.tmForm.logoUrl = res.data;
        },

        // 图片文件之前的钩子，参数为上传的文件。用于判断上传的图片是否合规
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },

        // 对话框确定按钮回调--添加或修改品牌时调用
        addOrUpdateTradeMark() {
            // 当全部验证的字段通过后，再去实现我们的业务功能
            this.$refs.ruleForm.validate(async (success) => {
                // console.log(success);   
                // 如果全部字段验证成功，success为true。成功则执行业务功能
                if (success) {
                    // 隐藏对话框
                    this.dialogFormVisible = false;
                    // 发请求（添加/修改品牌）
                    let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm);
                    // console.log(result);
                    if (result.code == 200) {
                        // 添加成功，顶部会弹出一个成功信息：添加品牌成功/修改品牌成功
                        // this.$message(this.tmForm.id ? '修改品牌成功!' : '添加品牌成功!');
                        this.$message({
                            type: 'success',
                            message: this.tmForm.id ? '修改品牌成功!' : '添加品牌成功!'
                        })
                        // 发送请求更新列表
                        // 如果是添加品牌，回到在第1页，如果是修改品牌，则留在当前页
                        this.getPageList(this.tmForm.id ? this.page : 1);
                    }
                } else {
                    console.log('提交错误!!');
                    return false;
                }
            });
        },

        // 删除品牌的操作
        deleteTradeMark(row) {
            // row是当前用户选择的品牌信息
            // console.log(row);

            this.$confirm(`你确定删除${row.tmName}, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {    //当用户点击‘确定’按钮会触发then()
                // 点击确定后，重新发送请求，更新数据
                let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
                // console.log(result);
                if (result.code == 200) {
                    // 提示删除成功
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    // 再次获取品牌数据更新列表（一个优化：我们删除完后应该停留在当前页。）
                    this.getPageList(this.list.length>1 ? this.page : this.page-1);
                }
            }).catch(() => {   //当用户点击‘取消’按钮会触发catch()
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },

};
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>