<template>
    <div>
        <!--label-width   表单域标签的宽度，例如'80px'。作为Form直接子元素的form-item会继承该值。支持auto。
            v-model或者:model    这个属性的作用就是把表单的数据收集到哪个对象的身上，将来表单验证也需要这个属性 -->
        <el-form ref="form" label-width="80px" :model="spuList">
            <!-- 子元素的el-form-item的所有label-width都为80px -->
            <el-form-item label="SPU名称">
                <el-input placeholder="SPU名称" v-model="spuList.spuName"></el-input>
            </el-form-item>

            <el-form-item label="品牌">
                <!-- 含义：将子标签收集的trademark.id存入到spuList.tmId对象中 -->
                <el-select placeholder="请选择品牌" v-model="spuList.tmId">
                    <el-option :label="trademark.tmName" :value="trademark.id" v-for="(trademark, index) in tradeMarkList"
                        :key="trademark.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="SPU描述">
                <!--type="textarea"   设置表单域
                    rows   设置表单域大小行数 -->
                <el-input type="textarea" rows="4" placeholder="SPU描述" v-model="spuList.description"></el-input>
            </el-form-item>

            <el-form-item label="SPU图片">
                <!-- 上传图片 -->
                <!--action  图片要上传去的地址，我们就写
                    list-type="picture-card"  使用list-type属性来设置文件列表的样式。picture-card为照片墙形式
                    :show-file-list   是否显示已上传文件列表
                    file-list	上传的文件列表,数组格式 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
                    :on-preview="handlePictureCardPreview"  预览，点击文件列表中已上传的文件时的钩子
                    :on-success="handleAvatarSuccess"   文件上传成功时的钩子,当上传成功，会执行一次 
                    :before-upload="beforeAvatarUpload"   上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
                    before-remove	删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。
                -->
                <el-upload 
                    action="/dev-api/admin/product/fileUpload" 
                    list-type="picture-card" 
                    :file-list="spuImageList"
                    :on-preview="handlePictureCardPreview" 
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <!-- Dialog 弹出一个对话框，适合需要定制性更大的场景。在这里用于显示大图 -->
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>

            <el-form-item label="销售属性">
                <!-- attrIdAndAttrName字段就收集‘unselect.id:unselect.name’样式的数据 -->
                <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
                    <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect,index) in unSelectSaleAttr" :key="unselect.id"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
                <!-- 展示当前Spu属于自己的销售属性 -->
                <!-- :data    表格组件将来需要展示的数据--数组格式  -->
                <el-table border style="width: 100%" :data="spuList.spuSaleAttrList">
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="saleAttrName" label="属性名" width="width">
                    </el-table-column>
                    <el-table-column prop="prop" label="属性值名称列表" width="width">
                        <!-- 作用域插槽 -->
                        <template slot-scope="{row,$index}">
                            <!-- {{ $index }}---{{ row是全部的销售属性对象 }} -->
                            <!-- tag标签 -->
                            <!--closable	 是否可关闭
                                disable-transitions	  是否禁用渐变动画
                                @close="handleClose(tag)"   关闭 Tag 时触发的事件  -->
                            <el-tag 
                                v-for="(tag,index) in row.spuSaleAttrValueList" 
                                :key="tag.id" 
                                closable 
                                :disable-transitions="false"
                                @close="row.spuSaleAttrValueList.splice(index,1)"
                            >
                                {{ tag.saleAttrValueName }}
                            </el-tag>
                            <!-- 底下的结构可以当做之前span和input的切换 -->
                            <!-- @keyup.enter.native="handleInputConfirm" -->
                            <el-input 
                                class="input-new-tag" 
                                v-if="row.inputVisible" 
                                v-model="row.inputValue" 
                                ref="saveTagInput"
                                size="small" 
                                @blur="handleInputConfirm(row)"
                            >
                            </el-input>
                            <!-- @click="showInput" -->
                            <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <!-- 作用域插槽 -->
                        <template slot-scope="{row,$index}">
                            <!-- {{ $index }}---{{ row是全部的销售属性对象 }} -->
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="spuList.spuSaleAttrList.splice($index,1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
                <el-button @click="cancelSpu">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'SpuForm',

    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            // 存储spu信息的属性：初始化的时候是个空对象，在修改Spu的时候，会向服务器发起请求，返回Spu信息（对象），在修改Spu的时候可以利用服务器返回的这个对象来收集最新的数据提交给服务器。
            // 在添加Spu的时候并没有向服务器发请求，我们就可以查看文档看收集数据的时候有哪些字段，我们就可以先把数据结构给出来。
            spuList: {
                "category3Id": 0,    //三级分类的id
                "tmId": 0,           //品牌的id
                "description": "",   //描述
                "spuName": "",       // Spu的名称
                "spuImageList": [     //Spu图片的信息
                    // {
                    //     "id": 0,
                    //     "imgName": "string",
                    //     "imgUrl": "string",
                    //     "spuId": 0
                    // }
                ],
                "spuSaleAttrList": [   //销售属性与属性值的收集
                    // {
                    //     "baseSaleAttrId": 0,
                    //     "id": 0,
                    //     "saleAttrName": "string",
                    //     "spuId": 0,
                    //     "spuSaleAttrValueList": [
                    //         {
                    //             "baseSaleAttrId": 0,
                    //             "id": 0,
                    //             "isChecked": "string",
                    //             "saleAttrName": "string",
                    //             "saleAttrValueName": "string",
                    //             "spuId": 0
                    //         }
                    //     ]
                    // }
                ],
            },
            // 存储品牌信息的属性
            tradeMarkList: [],
            // 存储Spu图片的属性
            spuImageList: [],
            // 存储品牌全部的销售属性
            saleAttrList: [],
            // 收集未选中的销售属性的id和名称
            attrIdAndAttrName:'',
        }
    },

    computed:{
        // 计算还未选择的销售属性
        unSelectSaleAttr(){
            // 整个项目当中销售属性一共三个。分别是颜色，尺码和版本。--存放在saleAttrList
            // 当前Spu所有的属于自己的销售属性在:spuList.spuSaleAttrList
            // filter()方法直接创建一个新的数组，新数组的元素是通过检查指定数组中符合条件的所有元素组成，主要用于筛选数组。！！！！
            let result=this.saleAttrList.filter(item=>{
                // every()方法--every()是对数组中每一项运行给定函数，如果该函数对每一项返回true,则返回true。
                return this.spuList.spuSaleAttrList.every(item1=>{
                    return item.name!=item1.saleAttrName;    
                })
            })
            return result;  //result存放的是saleAttrList中在spuList.spuSaleAttrList中没有出现的销售属性的数组    
        }
    },

    methods: {
        // 照片墙删除某个图片的时候会触发
        handleRemove(file, fileList) {
            // file为被删除的图片，fileList是删除图片以后，剩下图片的数组集合
            // console.log(file, fileList);

            // 收集照片墙图片的数据
            // 注意：对于已有的图片，照片墙里面的图片有name，url字段，但是我们服务器并不需要这两个字段，将来还需要将这两个字段去掉。
            this.spuImageList=fileList;
        },
        // 照片墙图片预览的回调
        handlePictureCardPreview(file) {
            // 将图片地址赋给dialogImageUrl属性，用于放大图片
            this.dialogImageUrl = file.url;
            // 显示对话框大图
            this.dialogVisible = true;
        },

        // 文件上传成功时的钩子,当上传成功，会执行一次 
        handleSuccess(response,file,fileList){
            // response是上传成功的成功信息，file为上传的图片，fileList是上传图片以后，所有图片的数组集合
            // console.log(response,file,fileList);

            // 收集照片墙图片的数据
            // 注意：对于新增和原有的图片，照片墙里面的图片有name，url字段，但是我们服务器并不需要这两个字段，将来还需要将这两个字段去掉。
            this.spuImageList=fileList;
        },

        // 初始化SpuForm数据
        async initSpuData(spu) {
            // spu就是某一项Spu的具体信息
            // console.log(spu);

            // 1.发请求获取Spu信息
            let spuResult = await this.$API.spu.reqOneSpu(spu.id);
            // console.log(spuResult); 
            if (spuResult.code == 200) {
                // 在修改spuList的时候，是需要向服务器发请求的，把服务器返回的数据，赋值给spuList
                this.spuList = spuResult.data;
            }

            // 2.获取品牌的信息  
            let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
            // console.log(tradeMarkResult);
            if (tradeMarkResult.code == 200) {
                this.tradeMarkList = tradeMarkResult.data;
            }

            // 3.获取Spu图片的信息   
            let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
            // console.log(spuImageResult);
            if (spuImageResult.code == 200) {
                // this.spuImageList = spuImageResult.data;
                //由于照片墙的数组需要特殊的字段，我们在获取到后台服务器传给我们的数据后，可以对它进行处理一下，再赋值给我们的spuImageList字段。
                let imageList = spuImageResult.data;
                imageList.forEach(item => {
                    item.name = item.imgName;
                    item.url = item.imgUrl;
                })
                // 把整理好的数据赋值给spuImageList
                this.spuImageList = imageList;
            }

            // 4.获取品牌全部的销售属性
            let saleAttrResult = await this.$API.spu.reqSaleAttrList();
            // console.log(saleAttrResult);
            if (saleAttrResult.code == 200) {
                this.saleAttrList = saleAttrResult.data;
            }
        },

        // 添加新的销售属性
        addSaleAttr(){
            // 我们已经将收集的数据存放在attrIdAndAttrName字段。注意得改下格式。
            // 分割字符串
            const [baseSaleAttrId,saleAttrName]=this.attrIdAndAttrName.split(':');
            // 向spuList对象的spuSaleAttrList字段添加新的销售属性
            let newSaleAttr={
                baseSaleAttrId,
                saleAttrName,
                spuSaleAttrValueList:[]
            }
            // 添加新的销售属性
            this.spuList.spuSaleAttrList.push(newSaleAttr);
            // 清空数据
            this.attrIdAndAttrName='';
        },

        // 添加销售属性的添加按钮的回调
        addSaleAttrValue(row){
            // 点击添加按钮后，需要把button变为input，通过inputVisible属性来控制。
            // console.log(row);

            // 销售属性值对象原本没有该字段，我们新增inputVisible这个响应式字段。
            // es5新增vm.$set()---向属性值对象新增一个响应式属性
            this.$set(row,'inputVisible',true);   //第三个参数就是值
            // 我们还需要新增属性inputValue来收集input的销售属性值，同样为响应式字段。
            this.$set(row,'inputValue','');
        },

        // el-input失去焦点的事件    
        handleInputConfirm(row){
            // 不再显示el-button
            row.inputVisible=false;
            // 解构出销售属性中需要的字段：baseSaleAttrId与saleAttrValueName，其中saleAttrValueName的值和row中的inputValue一致。
            const {baseSaleAttrId,inputValue}=row;
            // 判断一下1：新增的销售属性值名称不能为空
            if(inputValue.trim()==''){
                this.$message('属性值不能为空！');
                return;
            }
            // 判断一下2：属性值不能重复  （如果全不等，也就是没有重复every()就返回true,有重复返回false）
            let result=row.spuSaleAttrValueList.every(item=>{
                return item.saleAttrValueName!=inputValue;
            })
            if(!result){
                this.$message('属性值不能重复！');
                return;
            }

            // 收集销售属性值
            let newSaleAttrValue={
                baseSaleAttrId,
                saleAttrValueName:inputValue,
            };
            // 将收集的销售属性值放入到spuSaleAttrValueList中
            row.spuSaleAttrValueList.push(newSaleAttrValue);
        },

        // 保存按钮触发的回调  
        async addOrUpdateSpu(){
            // 整理参数：
            // （1）照片墙新增的图片数据是没有imgUrl和imgName字段的，我们需要给它们添加上这两个字段。
            this.spuList.spuImageList=this.spuImageList.map((item)=>{
                return {
                    imgName:item.name,
                    imgUrl:(item.response && item.response.data) || item.url,
                }
            })
            // 发请求
            let result=await this.$API.spu.reqAddOrUpdateSpu(this.spuList);
            // console.log(result);
            if(result.code==200){
                this.$message({type:'success',message:'保存修改'});
            }
            // 通知父组件回到scene=0场景---自定义事件
            // 我们需要区分添加还是修改Spu,修改Spu的话不需要回到第1页。
            this.$emit('changeScene',{scene:0,flag:this.spuList.id?'添加':'修改'});
            // 清空数据
            Object.assign(this._data,this.$options.data());
        },

        // 点击添加Spu按钮的时候，发请求的函数
        async addSpuData(category3Id){
            // 收集三级分类的id---category3Id
            this.spuList.category3Id=category3Id;
            // 1.获取品牌的信息  
            let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
            // console.log(tradeMarkResult);
            if (tradeMarkResult.code == 200) {
                this.tradeMarkList = tradeMarkResult.data;
            }

            // 2.获取品牌全部的销售属性
            let saleAttrResult = await this.$API.spu.reqSaleAttrList();
            // console.log(saleAttrResult);
            if (saleAttrResult.code == 200) {
                this.saleAttrList = saleAttrResult.data;
            }
        },

        // 取消按钮
        cancelSpu(){
            // 自定义事件-切换回到主页面scene=0
            this.$emit('changeScene', {scene:0,flag:''});
            // 清空SpuForm的历史数据
            // assign()用于将源对象的所有可枚举属性复制到目标对象中。
            // 组件实例this._data，可以操作data当中的响应式数据，this.$options.data()是组件的配置对象，保存着data数据格式
            Object.assign(this._data,this.$options.data());
            // console.log(this._data);
            // console.log(this.$options.data());
        }
    },
};
</script>

<style>
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>