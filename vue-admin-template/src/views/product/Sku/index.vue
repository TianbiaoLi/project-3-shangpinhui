<template>
  <div>
    <!-- 表格 -->
    <!-- v-loading="loading" -->
    <el-table :data="records" style="width:100%" border >
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80"></el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80"></el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="info" icon="el-icon-bottom" size="mini" v-if="row.isSale==0" @click="sale(row)"></el-button>
          <el-button type="success" icon="el-icon-top" size="mini" v-else @click="cancel(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="text-align:center"
      :current-page="page"
      :page-sizes="[3,5,10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes, total"
      :total="total"
      @current-change="getSkuList"
      @size-change="handleSizeChange">
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer
      title="我是标题"
      :visible.sync="show"
      :show-close="false"
      size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.spice}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag type="success" v-for="(attr,index) in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right:10px">{{attr.attrId}}-{{attr.attrName}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel>
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" height="300px">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data(){
    return{
      page:1,//当前第几页，默认1
      limit:10,//当前页面几条数据
      records:[],//存储分页器当前页展示的数据
      total:0,//一共有多少数据
      skuInfo:{},//sku详情数据
      show:false,//抽屉显示与隐藏
    }
  },
  methods:{
    // 获取sku数据
    async getSkuList(pages=1){
      this.page = pages
      const {page,limit} = this
      let result = await this.$API.sku.reqSkuList(page,limit);
      if(result.code==200){
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // 每页数据条数发生变化
    handleSizeChange(limit){
      this.limit = limit;
      this.getSkuList()
    },
    // 上架操作
    async sale(row){
      let result = await this.$API.sku.skuSale(row.id);
      if(result.code==200){
        row.isSale=1;
        this.$message({type:'success',message:'上架成功'});
        this.getSkuList();
      }
    },
    // 下架操作
    async cancel(row){
      let result = await this.$API.sku.skuCancel(row.id);
      if(result.code==200){
        row.isSale=0;
        this.$message({type:'success',message:'下架成功'});
        this.getSkuList();
      }
    },
    // 编辑操作，正在开发中
    edit(){
      this.$message({type:'info',message:'正在开发中'});
    },
    // 获取sku详情
    async getSkuInfo(sku){
      let result = await this.$API.sku.reqSkuById(sku.id);
      if(result.code==200){
        this.skuInfo = result.data;
        // 展示抽屉
        this.show = true;
      }
    }
  },
  mounted(){
    // 获取sku列表数据
    this.getSkuList();
  }
};
</script>

<style scoped>
  .el-carousel{
    display: block;
    margin: 0 auto;
    width: 400px;
  }
  .el-row .el-col-5{
    font-size: 18px;
    text-align: right;
  }
  .el-col{
    margin: 10px 10px;
  }
  /* 深度选择器 样式穿透 */
  >>>.el-carousel__button{
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
  }
</style>
