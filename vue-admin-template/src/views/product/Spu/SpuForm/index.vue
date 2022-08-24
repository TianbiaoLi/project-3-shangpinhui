<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="(unselect, index) in unSelectSaleAttr"
            :key="unselect.id"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- @close="handleClose(tag)" -->
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- @keyup.enter.native="handleInputConfirm"  -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
                @keyup.enter.native="$event.target.blur"
              ></el-input>
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // 存储spu信息属性
      spu: {
        // 三级分类id
        category3Id: 0,
        // 描述
        description: "",
        // spu名称
        spuName: "",
        // 品牌id
        tmId: "",
        // 收集SPU图片的信息
        spuImageList: [
          // {
          //   id:0,
          //   imgName:"",
          //   imgUrl:"",
          //   spuId:0,
          // },
        ],
        // 平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId:0,
          //   id:0,
          //   saleAttrName:"",
          //   spuId:0,
          //   spuSaleAttrValueList:[
          //     {
          //       baseSaleAttrId:0,
          //       id:0,
          //       isChecked:"",
          //       saleAttrName:"",
          //       saleAttrValueName:"",
          //       spuId:0,
          //     }
          //   ]
          // }
        ],
      },
      tradeMarkList: [], // 存储品牌信息
      spuImageList: [], // 存储spu图片
      saleAttrList: [], // 所有的3种销售属性
      // 收集未选择的销售属性id
      attrIdAndAttrName: "",
    };
  },
  methods: {
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      // 收集最新的图片墙数据
      this.spuImageList = fileList;
    },
    // 照片墙预览功能
    handlePictureCardPreview(file) {
      // 将图片url用于预览展示
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 照片墙上传
    handlerSuccess(response, file, fileList) {
      // 收集最新的图片墙数据
      this.spuImageList = fileList;
    },
    // 点击编辑，初始化，发请求获取数据
    async initSpuData(spu) {
      // 获取spu信息
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取spu图片
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        // 由于照片墙展示需要对应关键词，对返回数据进行处理
        let ListArr = spuImageResult.data;
        ListArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = ListArr;
      }
      // 获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 对收集到的数据进行分割，数组按照位置解构
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      // 向spu对象添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr); // 更改spu.spuSaleAttrList内容后，计算属性会重新计算未选择属性
      // 清空内容
      this.attrIdAndAttrName = "";
    },
    // 添加按钮：展示销售属性值的input框
    addSaleAttrValue(row) {
      // 添加响应式数据，控制input和button切换
      this.$set(row, "inputVisible", true);
      // 添加响应式数据，收集input值
      this.$set(row, "inputValue", "");
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    // 销售属性值 input失去焦点 新增销售属性值
    handleInputConfirm(row) {
      // 解构出数据
      const { baseSaleAttrId, inputValue } = row;
      // 属性值不为空
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      // 属性值不能重复
      if (
        !row.spuSaleAttrValueList.every(
          (item) => item.saleAttrValueName != inputValue.trim()
        )
      ) {
        this.$message("属性值不能重复");
        this.$refs.saveTagInput.focus();
        return;
      }
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      // 显示button
      row.inputVisible = false;
    },
    // 保存按钮回调
    async addOrUpdateSpu() {
      // 整理照片墙参数
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: item.response ? item.response.data : item.url,
        };
      });
      this.spu.spuImageList.push();
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功" });
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      }
      // 清理数据 将该组件的模版data函数赋值给响应式之后的_data，实现初始化
      Object.assign(this._data, this.$options.data());
    },
    // 点击添加按钮，初始化，获取数据
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id;
      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 取消按钮
    cancel() {
      // 通知父组件切换场景
      this.$emit("changeScene", {
        scene: 0,
        flag: this.spu.id ? "修改" : "添加",
      });
      // 清理数据 将该组件的模版data函数赋值给响应式之后的_data，实现初始化
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    unSelectSaleAttr() {
      // 整个平台销售属性  saleAttrList
      // 当前spu拥有属性 spu.spuSaleAttrList
      return this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
    },
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
