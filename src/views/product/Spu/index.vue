<template>
    <div>
        <el-card style="margin: 20px 0px;">
            <!-- 三级联动是全局组件，可以直接使用 -->
            <CategorySelect @getCategoryId="getCategoryId" :isShow="scene!=0"></CategorySelect>
        </el-card>
        <el-card>
            <!-- 下方有三种切换状态，分别是展示spu，添加/修改spu和添加sku三个状态。 -->
            <!-- 展示spu -->
            <div v-show="scene==0">
                <!-- 添加SPU按钮 -->
                <el-button type="primary" icon="el-icon-plus"  :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
                <!-- 表格-展示spu列表 -->
                <!-- data    表格组件将来需要展示的数据--数组格式 【非常重要】 -->
                <el-table border style="width: 100%" :data="records">
                    <!-- 每一列 -->
                    <!-- prop	对应列内容的字段名【重要】，也可以使用 property 属性 -->
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="spuName" label="SPU名称" width="180">
                    </el-table-column>
                    <el-table-column prop="description" label="SPU描述" width="width">
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <!-- 作用域插槽 -->
                        <!-- $index为索引值-->
                        <template slot-scope="{row,$index}">
                            <!-- {{ $index }}-------{{ row }} -->
                            <!-- size="mini" 表示将图标缩小 -->
                            <!-- 添加sku按钮 -->
                            <HintButton type="success" icon="el-icon-plus" size="mini" title='添加sku' @click="addSku(row)"></HintButton>
                            <!-- 修改spu按钮 -->
                            <HintButton type="warning" icon="el-icon-edit" size="mini" title='修改spu' @click="updateSpu(row)"></HintButton>
                            <!-- 查看sku列表按钮 -->
                            <HintButton type="info" icon="el-icon-info" size="mini" title='查看当前spu的sku列表' @click="showSkuList(row)"></HintButton>
                            <!-- 删除spu按钮 -->
                            <!-- 气泡确认框 -->
                            <!-- confirm	点击确认按钮时触发	— -->
                            <!-- cancel	点击取消按钮时触发 -->
                            <el-popconfirm title="你确定要删除" @onConfirm="deleteSpu(row)">
                                <HintButton type="danger" icon="el-icon-delete" size="mini" title='删除spu' slot="reference"></HintButton>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页器 -->
                <!--四大要素：数据总条数total，当前页current-page，每页展示条数page-size，连续页码数（默认5）
                background	是否为分页按钮添加背景色
                layout	组件布局，子组件名用逗号分隔。例如"prev, pager, next,->, sizes,total" ->表示右边的都要靠右放
                page-count	总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性	
                pager-count	页码按钮的数量，当总页数超过该值时会折叠。pager-count为7，连续页码数就为5
                @size-change	改变时会触发	每页条数
                @current-change	改变时会触发	当前页
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
                    @current-change="getSpuList"
                    @size-change="handleSizeChange"
                >
                </el-pagination>
            </div>

            <!-- 添加/修改spu -->
            <SpuForm v-show="scene==1" @changeScene="changeScene" ref="spu"></SpuForm>
            
            <!-- 添加sku -->
            <SkuForm v-show="scene==2" ref="sku" @changeScenes="changeScenes"></SkuForm>
        </el-card>

        <!-- 查看sku列表时弹出的对话框 -->
        <!-- before-close	关闭前的回调，会暂停 Dialog 的关闭 -->
        <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="closeBefore">
            <!-- v-loading="loading"  加载中效果 -->
            <el-table :data="skuList" border style="width: 100%;" v-loading="loading">
                <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
                <el-table-column prop="price" label="价格" width="width"></el-table-column>
                <el-table-column prop="weight" label="重量" width="width"></el-table-column>
                <el-table-column label="默认图片" width="width">
                    <!-- 作用域插槽 -->
                    <template slot-scope="{row,$index}">
                        <!-- {{ $index }}-------{{ row }} -->
                        <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import SpuForm from './SpuForm/index';
import SkuForm from './SkuForm/index';
export default {
    name: 'Spu',
    data() {
        return {
            // 全部一级，二级，三级分类的id
            category1Id: '',
            category2Id: '',
            category3Id: '',
            // 接收Spu列表数据的字段
            records: [],
            // 是否显示Spu列表以及控制三级联动的可操作状态
            // isShowTable: true,
            // 分页器相关字段
            page:1,      // 分页器当前页
            limit:3,     // 每页大小
            total:0,     // 分页器总共数据量
            // 0代表展示Spu列表数据，1代表添加/修改spu，2代表添加sku
            scene:0,
            // 控制对话框的显示与隐藏
            dialogTableVisible:false,
            // 保存跳转到对话框后的数据
            spu:{},
            // 存储sku列表的数据
            skuList:[],
            // 加载中效果
            loading:true,
        }
    },
    components:{
        SkuForm,
        SpuForm,
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

            // 发请求获取Spu列表数据
            this.getSpuList();
        },

        // 封装发请求获取Spu列表数据的方法
        async getSpuList(pager=1) {
            this.page = pager;
            // 解构对象，获取page, limit, category3Id数据
            const { page, limit, category3Id } = this;
            // 发请求
            let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
            // console.log(result);
            if (result.code == 200) {
                this.total=result.data.total;
                this.records = result.data.records;
            }
        },

        // 点击分页器的第几页按钮的回调----同样弃用--改为使用上面getSpuList也可以实现
        // getPageList(page){
        //     // console.log(page);
        //     this.page=page;
        //     // 再一次发请求获取Spu列表数据以更新列表
        //     this.getSpuList();
        // },

        // 当分液器的每一页展示数据条数发生变化时的回调
        handleSizeChange(limit){
            // console.log(limit);
            this.limit=limit;
            // 再一次发请求获取Spu列表数据以更新列表
            this.getSpuList();
        },

        // 添加Spu按钮的回调
        addSpu(){
            // 切换页面
            this.scene=1;
            // 通知子组件发请求（两个请求：获取品牌的数据和获取全部销售属性的数据）
            this.$refs.spu.addSpuData(this.category3Id);    //将category3Id传过去

        },

        // 修改spu按钮的回调
        updateSpu(row){
            // console.log(row);
            // 切换页面
            this.scene=1;
            // 获取子组件SpuForm信息
            // console.log(this.$refs.spu);
            // 每次切换到SpuForm页面就发请求
            this.$refs.spu.initSpuData(row);
        },

        // 自定义事件-SpuForm页面的取消和保存按钮
        changeScene({scene,flag}){
            // flag  这个形参，是为了区分保存按钮是修改还是添加Spu
            // scene 是子组件SpuForm传递过来的值0
            // console.log(scene,flag);
            this.scene=scene;
            // 再一次发请求获取Spu列表数据以更新列表，并注意回到当前页
            this.getSpuList(this.page);
            if(flag=='修改'){
                // 修改就留在当前页
                this.getSpuList(this.page);
            }else{
                // 添加就前往第1页
                this.getSpuList();
            }
        },

        // 自定义事件-SkuForm页面的取消和保存按钮
        changeScenes(scene){
            // scene 是子组件SpuForm传递过来的值0
            // console.log(scene);
            this.scene=scene;
        },

        // 删除Spu按钮的回调  
        async deleteSpu(row){
            // 发请求
            let result = await this.$API.spu.reqDeleteSpu(row.id);
            // console.log(result);
            if (result.code == 200) {
                this.$message({type:'success',message:'删除成功'});
                // 再一次发请求获取Spu列表数据以更新列表
                // 注意：删除数据后刷新页面要留在当前页(大于1)，（等于1）则前往上一页
                this.getSpuList(this.records.length>1 ? this.page : this.page-1);
            }
        },

        // 添加Sku按钮的回调
        addSku(row){
            // 切换场景，2代表添加sku。
            this.scene=2;
            // 父组件调用子组件的方法，每次切换到SpuForm页面就发请求。--三个请求
            this.$refs.sku.getData(this.category1Id,this.category2Id,row);
        },

        // 查看当前Spu的sku列表按钮的方法
        async showSkuList(spu){
            // 当点击按钮后，显示对话框
            this.dialogTableVisible=true;
            // 保存跳转到对话框后的数据
            this.spu=spu;
            // 获取sku列表的数据
            let result=await this.$API.spu.reqSkuList(spu.id);
            // console.log(result);
            if(result.code==200){
                this.skuList=result.data;
                // 让loading加载中效果隐藏
                this.loading=false;
            }
        },

        // 关闭对话框前的回调
        closeBefore(done){
            // loading属性变为true，便于下一次打开时，仍有loading效果。
            this.loading=true;
            // 清空sku列表数据
            this.skuList=[];
            // 关闭对话框
            done();
        }
    }
};
</script>

<style lang="scss" scoped></style>
