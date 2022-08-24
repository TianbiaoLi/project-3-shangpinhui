<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 展示平台属性 -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!categoryIdForm.category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格，展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column
            prop="attrValueList"
            label="属性值列表"
            width="width"
          >
            <template slot-scope="{ row, $iondex }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 20px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
                style="margin-right:3px"
              ></el-button>
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.attrName}吗？`"
                @onConfirm="deleteAttr(row)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或修改平台属性 -->
      <div v-show="!isShowTable">
        <!-- 第一行 -->
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 第二行 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <!-- 表单部分 -->
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 使用flag判断input和span的显示与隐藏 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 保存|取消 按钮 -->
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      // 保存回传的三级分类各级id
      categoryIdForm: {},
      // 平台属性
      attrList: [],
      // 是否展示平台属性
      isShowTable: true,
      // 收集新增|修改属性使用
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值，可以有多个
        ],
        categoryId: 0, //三级分类id
        categoryLevel: 3, //服务器用于区分几级id
      },
    };
  },
  methods: {
    // 三级联动子组件自定义事件回调
    getCategoryId(cForm) {
      // 获取三级分类id
      this.categoryIdForm = cForm;
      // 发请求获取平台属性数据
      this.getAttrList();
    },
    // 当用户确定三级分了数据时，发请求获取数据进行展示
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this.categoryIdForm;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      this.attrList = result.data;
    },
    // 添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //相应属性的id，添加属性时，因为服务器还未存储该属性，因此没有id，返回undefined；修改属性时，已有id，因此赋值
        valueName: "",
        flag: true, //input和span切换标记
      });
      // 添加元素自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // +添加属性 按钮回调
    addAttr() {
      // 切换table显示与隐藏
      this.isShowTable = false;
      // 清除数据，收集三级分类id
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [
          //属性值，可以有多个
        ],
        categoryId: this.categoryIdForm.category3Id, //三级分类id
        categoryLevel: 3, //服务器用于区分几级id
      };
    },
    // 修改某个属性
    updateAttr(row) {
      this.isShowTable = false;
      // 将选中的属性数据赋值给attrInfo，用于展示
      this.attrInfo = cloneDeep(row);
      // 修改时添加flag标记用于切换input和span
      this.attrInfo.attrValueList.forEach((item) => {
        // 使用$set实现响应式变化
        this.$set(item, "flag", false);
      });
    },
    // 点击input，失去焦点事件，变为查看模式
    toLook(row) {
      // 新增属性值不为空
      if (row.valueName.trim() == "") {
        this.$message("请输入一个正常的属性值");
      }
      // 新增属性不能与已有重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        // 通过遍历判断，需要将自身去除
        // row是最新添加进去的，item是包含row的所有数据
        if (item != row) {
          return row.valueName == item.valueName;
        }
      });
      // 如果有重复，不执行后面代码
      if (isRepeat) {
        this.$message("与已有属性值重复");
        return;
      }
      row.flag = false;
    },
    // 点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      // 因为使用v-if，因此点击变为编辑模式会在dom添加input，需要时间，等待重绘重排完毕后再获取焦点
      // 原生js/vue原生写法 获取兄弟节点 代码过长，因此使用refs
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 添加及编辑 气泡确认框回调
    // 目前版本elementUI 2.13.X 使用onConfirm，最新版使用confirm
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 保存按钮，添加或修改属性值操作
    async addOrUpdateAttr() {
      // 整理参数
      // 1.属性值为空，不提交
      // 2.flag不提交
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 拿到属性值非空的
          if (item.valueName != "") {
            // 将flag属性删除
            delete item.flag;
            return true;
          }
        }
      );
      try {
        // 发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        // 成功，返回展示数据页面
        this.isShowTable = true;
        // 提示保存成功
        this.$message({ type: "success", message: "保存成功" });
        // 保存成功后，再次获取平台数据展示
        this.getAttrList();
      } catch (error) {
        this.$message("保存失败");
      }
    },
    // 展示页面删除按钮 气泡确认框 回调
    async deleteAttr(row) {
      // 调整数据
      const newAttrInfo = cloneDeep(row);
      newAttrInfo.attrValueList = [];
      try {
        // 发请求
        await this.$API.attr.reqAddOrUpdateAttr(newAttrInfo);
        // 提示删除成功
        this.$message({ type: "success", message: "删除成功" });
        // 删除成功后，再次获取平台数据展示
        this.getAttrList();
      } catch (error) {
        this.$message("删除失败");
      }
    },
  },
};
</script>

<style></style>
