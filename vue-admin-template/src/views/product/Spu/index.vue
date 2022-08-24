<template>
  <div>
    <!-- 顶部三级联动组件 -->
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <!-- 底部三部分切换 -->
    <el-card>
      <!-- 第一部分 scene:0 展示spu列表 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!categoryIdForm.category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="spu名称"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="spu描述"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              ></HintButton>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- @size-change="handleSizeChange"
          @current-change="handleCurrentChange" -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :total="total"
        >
        </el-pagination>
      </div>
      <div>
        <!-- 第二部分 scene:0 添加|修改spu -->
        <SpuForm
          v-show="scene == 1"
          @changeScene="changeScene"
          ref="spu"
        ></SpuForm>
        <!-- 第三部分 scene:0 添加sku -->
        <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes"></SkuForm>
      </div>
      <!-- 展示sku信息 -->
      <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
        <el-table :data="skuList" style="width:100%" border v-loading="loading">
          <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
          <el-table-column prop="price" label="价格" width="width"></el-table-column>
          <el-table-column prop="weight" label="重量" width="width"></el-table-column>
          <el-table-column label="默认图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      // 保存回传的三级分类各级id
      categoryIdForm: {},
      page: 1, // 分页器当前页码
      limit: 3, // 每页展示多少条数据
      total: 0, // 分页器一共获取多少条数据
      // spu列表数据
      records: [],
      scene: 0, // 三部分展示切换 0 1 2
      dialogTableVisible:false,// sku信息对话框显示/隐藏
      spu:{},//sku信息对话框接收传过来的初始spu对象
      skuList:[],//sku信息对话框发请求获取的数据
      loading:true,//sku信息对话框加载效果
    };
  },
  methods: {
    // 三级联动子组件自定义事件回调
    async getCategoryId(cForm) {
      // 获取三级分类id
      this.categoryIdForm = cForm;
      // 发请求获取Spu列表数据
      this.getSpuList();
    },
    // 当用户确定三级分了数据时，发请求获取数据进行展示 | 点击分页器页码，发请求获取数据
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      const { category3Id } = this.categoryIdForm;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 分页器每页条数变化时
    handleSizeChange(limit) {
      this.limit = limit;
      // 每页数量变化后，回到第一页开始展示，因此不需要配置page，使用默认的1
      this.getSpuList();
    },
    // 添加spu按钮，触发子组件初始化
    addSpu() {
      this.scene = 1;
      // 通知子组件发请求--2个--品牌、销售属性
      this.$refs.spu.addSpuData(this.categoryIdForm.category3Id);
    },
    // 修改某一个spu，触发子组件初始化
    updateSpu(row) {
      this.scene = 1;
      // 调用SpuForm子组件的init方法发请求获取数据
      this.$refs.spu.initSpuData(row);
    },
    // 第二部分 自定义事件回调,切换场景
    changeScene({ scene, flag }) {
      this.scene = scene;
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSpuList(this.records.length>1?this.page:this.page-1);
      }
    },
    // 添加sku
    addSku(row){
      this.scene = 2;
      // 通过ref调用子组件身上的初始化方法，发请求获取数据
      this.$refs.sku.getData(this.categoryIdForm,row);
    },
    // 第三部分 取消按钮回调 切换场景
    changeScenes(scene){
      this.scene = scene;
    },
    // 查看sku列表 按钮 回调
    async handler(spu){
      // 设置对话框可见
      this.dialogTableVisible = true;
      // 保存spu信息
      this.spu = spu;
      // 发请求获取sku列表数据
      let result = await this.$API.spu.reqSkuList(spu.id);
      if(result.code==200){
        this.skuList = result.data;
        this.loading = false
      }
    },
    // 关闭对话框的回调
    close(done){
      this.loading = true;
      this.skuList = [];
      done()
    }
  },
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style></style>
