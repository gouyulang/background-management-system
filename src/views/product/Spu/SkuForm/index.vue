<template>
    <div>
        <el-form ref="form" label-width="80px">
            <!-- 子元素的el-form-item的所有label-width都为80px -->
            <el-form-item label="SPU名称">
                {{spu.spuName}}
            </el-form-item>

            <el-form-item label="SKU名称">
                <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
            </el-form-item>

            <el-form-item label="价格(元)">
                <!-- type="number"  设置输入框输入数字格式，还可以增加和减少 -->
                <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
            </el-form-item>

            <el-form-item label="重量(千克)">
                <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
            </el-form-item>

            <el-form-item label="规格描述">
                <!-- type="textarea"   设置表单域 -->
                <el-input type="textarea" rows="4" placeholder="规格描述" v-model="skuInfo.skuDesc"></el-input>
            </el-form-item>

            <el-form-item label="品牌属性">
                <!-- inline	   行内表单模式 -->
                <el-form :inline="true" ref="form" label-width="80px">
                    <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="attr.attrId">
                        <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
                            <!-- :value属性是用于收集数据的，和父标签的v-model搭配使用。 -->
                            <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>

            <el-form-item label="销售属性">
                <!-- inline	   行内表单模式 -->
                <el-form :inline="true" ref="form" label-width="80px">
                    <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id">
                        <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
                            <!-- :value属性是用于收集数据的，和父标签的v-model搭配使用。 -->
                            <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>

            <el-form-item label="图片列表">
                <!--:data     表格组件将来需要展示的数据--数组格式
                    selection-change	当复选框选择项发生变化时会触发该事件 -->
                <el-table border style="width: 100%" :data="spuImageList" @selection-change="handleSelectionChange">
                    <!-- type属性为selection,设置table-复选框 -->
                    <el-table-column type="selection" prop="prop" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="prop" label="图片" width="width">
                        <!-- 作用域插槽 -->
                        <template slot-scope="{row,$index}">
                            <!-- {{ $index }}-------{{ row }} -->
                            <img :src="row.imgUrl" style="width: 100px;height: 100px;">
                        </template>
                    </el-table-column>
                    <el-table-column prop="imgName" label="名称" width="width">
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <!-- 作用域插槽 -->
                        <template slot-scope="{row,$index}">
                            <!-- {{ $index }}-------{{ row }} -->
                            <!-- 两个button之间的切换显示 -->
                            <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
                            <el-button v-else>默认</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'SkuForm',
    data() {
        return {
            // 保存图片的数据--父组件传来的图片数据
            spuImageList: [],
            // 存储销售属性的数据
            spuSaleAttrList: [],
            // 保存品牌属性列表数据
            attrInfoList: [],
            // 收集sku数据的字段
            skuInfo: {
                // 第一类收集的数据：父组件给的数据
                "category3Id": 0,
                "spuId": 0,
                "tmId": 0,
                // 第二类收集的数据：需要通过数据双向绑定v-model收集
                "skuName": "",
                "price": 0,
                "weight": "",          //重量
                "skuDesc": "",         //描述
                // 第三类收集的数据：需要自己写代码收集的
                "skuDefaultImg": "",   //默认图片字段
                "skuImageList": [       //收集sku图片的字段
                    // {
                    //     "imgName": "string",
                    //     "imgUrl": "string",
                    //     "isDefault": "string",    //0代表设置默认，1代表默认
                    //     "spuImgId": 0
                    // }
                ],
                "skuAttrValueList": [       //品牌属性列表字段
                    // {
                    //     // 我们只需要收集attrId和valueId即可
                    //     "attrId": 0,   
                    //     "valueId": 0,
                    // }
                ],
                "skuSaleAttrValueList": [    //收集销售属性列表的字段
                    // {
                    //     // 收集销售属值性我们只需要收集saleAttrId和saleAttrValueId即可。
                    //     "saleAttrId": 0,
                    //     "saleAttrValueId": 0,
                    // }
                ],
                
            },
            // 存储父组件传过来的row别名spu
            spu:{},
            // 收集图片的字段--保存复选框被选中的图片信息。需要注意:收集的数据中，缺少isDefault字段
            imageList:[],
        }
    },

    methods: {
        // 获取SkuForm数据
        async getData(category1Id, category2Id, spu) {
            // console.log(category1Id,category2Id,spu);
            // 收集父组件给的数据
            this.skuInfo.category3Id=spu.category3Id;
            this.skuInfo.spuId=spu.id;
            this.skuInfo.tmId=spu.tmId;
            this.spu=spu;

            // 发请求--三个请求         
            // （1）获取图片数据的请求
            let imageResult = await this.$API.spu.reqSpuImageList(spu.id);
            // console.log(imageResult);
            if (imageResult.code == 200) {
                let list = imageResult.data;
                // 给我们数据加上isDefault字段
                list.forEach(item => {
                    item.isDefault=0;    //0代表设置默认，1代表默认
                });
                this.spuImageList=list;
            }

            // （2）获取销售属性数据的请求
            let saleResult = await this.$API.spu.reqSpuSaleAttrList(spu.id);
            // console.log(saleResult);
            if (saleResult.code == 200) {
                this.spuSaleAttrList = saleResult.data;
            }

            // （3）获取品牌属性列表数据的请求
            let attrResult = await this.$API.spu.reqSpuAttrList(category1Id, category2Id, spu.category3Id);
            // console.log(attrResult);
            if (attrResult.code == 200) {
                this.attrInfoList = attrResult.data;
            }
        },

        // table表格复选框的事件
        handleSelectionChange(params){
            // params存放的是复选框中被选中的数据对象的数组，但需要注意收集的数据中，缺少isDefault字段
            // console.log(params);
            this.imageList=params;   //需要注意收集的数据中，缺少isDefault字段
        },

        // 点击设置默认的按钮触发的方法--排他操作
        changeDefault(row){
            // 图片列表的数据的isDefault字段变为0----这是为了保持只有一个被选为默认，即排他操作
            this.spuImageList.forEach(item=>{
                item.isDefault=0;
            })
            // 被点击图片列表的数据的isDefault字段变为1
            row.isDefault=1;
            // 收集默认图片的地址
            this.skuInfo.skuDefaultImg=row.imgUrl;
        },

        // 取消按钮的事件
        cancel(){
            // scene变为0，切换场景---自定义事件
            this.$emit('changeScenes',0);
            // 清除数据
            Object.assign(this._data,this.$options.data());
        },

        // 保存按钮的事件
        async save(){
            const {attrInfoList,spuSaleAttrList,imageList,skuInfo}=this;
            // 整理数据
            // （1）整理品牌属性
            // 整理品牌数据的方式1：
            // let arr=[];
            // // 把收集到的数据先整理一下（attrInfoList带有的attrIdAndValueId的字段中）
            // attrInfoList.forEach(item => {
            //     // 代表当前品牌属性进行了选择
            //     if(item.attrIdAndValueId){
            //         const [attrId,valueId]=item.attrIdAndValueId.split(':');
            //         // 携带给服务器的参数应该是对象
            //         let obj={attrId,valueId};
            //         arr.push(obj);
            //     }
            // });
            // // 将整理好的参数arr赋值给skuInfo
            // skuInfo.skuAttrValueList=arr;

            // 整理品牌数据的方式2：
            // reduce() 方法为数组的每个值（从左到右）执行提供的函数。
            skuInfo.skuAttrValueList=attrInfoList.reduce((prev,item)=>{
                // 代表当前品牌属性进行了选择
                if(item.attrIdAndValueId){
                    const [attrId,valueId]=item.attrIdAndValueId.split(':');
                    prev.push({attrId,valueId})
                }
                return prev;
            },[])

            // （2）整理销售属性
            skuInfo.skuSaleAttrValueList=spuSaleAttrList.reduce((prev,item)=>{
                // 代表当前销售属性进行了选择
                if(item.attrIdAndValueId){
                    const [saleAttrId,saleAttrValueId]=item.attrIdAndValueId.split(':');
                    prev.push({saleAttrId,saleAttrValueId})
                }
                return prev;
            },[])

            // （3）整理图片的数据
            skuInfo.skuImageList=imageList.map(item=>{
                return {
                    imgName:item.imgName,
                    imgUrl:item.imgUrl,
                    isDefault:item.isDefault,
                    spuImgId:item.id,
                }
            })

            // 发请求
            let result=await this.$API.spu.reqAddSku(skuInfo);
            // console.log(result);
            if(result.code==200){
                this.$message({type:'success',message:'保存成功'});
                // 成功则切换页面并更新页面数据
                // scene变为0，切换场景---自定义事件
                this.$emit('changeScenes',0);
                // 清除历史数据
                Object.assign(this._data,this.$options.data());
            }
        },
    }
};
</script>

<style lang="scss" scoped></style>