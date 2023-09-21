<template>
    <div>
        <!-- 表格组件 -->
        <!-- data:表格组件将来需要展示的数据--数组格式 
            border 添加边框-->
        <el-table style="width:100%" border :data="records">
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

            <el-table-column prop="skuName" label="名称" width="width">
            </el-table-column>

            <el-table-column prop="skuDesc" label="描述" width="width">
            </el-table-column>

            <el-table-column label="默认图片" width="110">
                <!-- 作用域插槽 -->
                <template slot-scope="{row,$index}">
                    <img :src="row.skuDefaultImg" style="width: 80px;height: 80px;">
                </template>
            </el-table-column>

            <el-table-column prop="weight" label="重量(KG)" width="80">
            </el-table-column>

            <el-table-column prop="price" label="价格(元)" width="80">
            </el-table-column>

            <el-table-column prop="prop" label="操作" width="width">
                <!-- 作用域插槽 -->
                <template slot-scope="{row,$index}">
                    <!-- 五个按钮，第一，二个按钮交替显示 -->
                    <el-button type="success" icon="el-icon-sort-down" size="mini" v-if="row.isSale==0" @click="onSale(row)"></el-button>
                    <el-button type="success" icon="el-icon-sort-up" size="mini" v-else @click="cancelSale(row)"></el-button >
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
                    <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页器 -->
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
            background 
            layout="prev, pager, next,->, sizes,total"
            @current-change="getSkuList"
            @size-change="handleSizeChange"
        >
        </el-pagination>

        <!-- 抽屉详情页 -->
        <!--:visible.sync   是否显示 Drawer，支持 .sync 修饰符 
            direction	    Drawer 打开的方向，属性值rtl/ltr/ttb/btt  如rtl表示right to left右往左，默认就是rtl
            before-close	关闭前的回调，会暂停Drawer的关闭
            :show-close	   是否显示关闭按钮
            size	Drawer 窗体的大小, 当使用 number 类型时, 以像素为单位, 当使用 string 类型时, 请传入 'x%', 否则便会以 number 类型解释   -->
        <el-drawer :visible.sync="show" :show-close="false" size="50%">
            <!-- Layout布局 -->
            <el-row class="el-row">
                <!-- 一行划分为24份-->
                <el-col :span="5" class="el-col-5">名称</el-col>
                <el-col :span="16">{{ skuInfo.skuName }}</el-col>
            </el-row>
            <el-row class="el-row">
                <el-col :span="5" class="el-col-5">描述</el-col>
                <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
            </el-row>
            <el-row class="el-row">
                <el-col :span="5" class="el-col-5">价格</el-col>
                <el-col :span="16">{{ skuInfo.price }} 元</el-col>
            </el-row>
            <el-row class="el-row">
                <el-col :span="5" class="el-col-5">平台属性</el-col>
                <el-col :span="16">
                    <!-- 作用域插槽 -->
                    <template>
                        <el-tag type="success" v-for="(attrValue,index) in skuInfo.skuAttrValueList" :key="attrValue.id" style="margin-right: 10px;">{{ attrValue.attrId }}-{{ attrValue.valueId }}</el-tag>
                    </template>
                </el-col>
            </el-row>
            <el-row class="el-row">
                <el-col :span="5" class="el-col-5">商品图片</el-col>
                <el-col :span="16">
                    <!-- 轮播图 -->
                    <el-carousel height="600px">
                        <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                            <img :src="item.imgUrl" style="width: 100%;height: 100%;">
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </el-drawer>
    </div>
</template>

<script>
export default {
    name: 'Sku',
    data(){
        return {
            page:1,    //代表当前页
            limit:10,   //代表当前页有多少条数据
            // 保存sku列表数据
            records:[],
            total:0,    //存储总页数
            // 保存sku详情信息
            skuInfo:{},
            show:false,   //控制抽屉显示
        }
    },

    mounted(){

        // 获取sku列表数据
        this.getSkuList();
    },

    methods:{
        // 获取sku列表数据的方法   
        async getSkuList(pager=1){
            this.page=pager;
            // 解构参数
            const {page,limit}=this;
            let result=await this.$API.sku.reqSkuList(page,limit);
            // console.log(result);
            if(result.code==200){
                this.total=result.data.total;
                this.records=result.data.records;
            }
        },
        // 修改每页数据展示条数
        handleSizeChange(limit){
            this.limit=limit;
            // 再次发请求更新数据
            this.getSkuList();
        },

        // 上架的操作  
        async onSale(row){
            let result=await this.$API.sku.reqOnSale(row.id);
            // console.log(result);
            if(result.code==200){
                row.isSale=1;
                this.$message({type:'success',message:'上架成功'});
            }
        },

        // 下架的操作   
        async cancelSale(row){
            let result=await this.$API.sku.reqCancelSale(row.id);
            // console.log(result);
            if(result.code==200){
                row.isSale=0;
                this.$message({type:'success',message:'下架成功'});
            }
        },

        // 正在开发中的按钮
        edit(){
            this.$message('正在开发中');
        },

        // SKU获取详情的方法
        async getSkuInfo(sku){
            // 显示抽屉详情页
            this.show=true;
            // 发请求，获取数据
            let result=await this.$API.sku.reqSkuById(sku.id);
            // console.log(result);
            if(result.code==200){
                this.skuInfo=result.data;
            }
        }
    }


};
</script>

<style>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}
.el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
/* 轮播图下标样式 */
.el-carousel__button {
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
}

</style>

<style scoped>
.el-row .el-col-5 {
    font-size: 18px;
    text-align: right;
}
.el-col {
    margin: 10px 10px;
}
/* 轮播图下标样式 */
/* 如果写在这里：深度选择器解决样式穿透 */
/* >>>.el-carousel__button {
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
} */
</style>