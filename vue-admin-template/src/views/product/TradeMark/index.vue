<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="marginl: 10px 0"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="tmName" label="品牌名称" width="width" />
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img
            :src="row.logoUrl"
            alt="图片丢了，往后翻翻看~"
            style="width: 100px; height: 100px"
        /></template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :pager-count="7"
      layout="prev, pager, next, jumper,->,sizes,total"
      @current-change="getPageList"
      @size-change="handleSieChange"
      :total="total"
    />
    <!-- 添加/修改对话框 -->
    <el-dialog
      :title="tradeMarkForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        style="width: 80%"
        :model="tradeMarkForm"
        :rules="rules"
        ref="rulerForm"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            autocomplete="off"
            v-model="tradeMarkForm.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="tradeMarkForm.logoUrl"
              :src="tradeMarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "TradeMark",
  data() {
    return {
      // 分页器第几页
      page: 1,
      // 当前页展示数据条数
      limit: 3,
      // 总数据条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 对话框显示与隐藏属性
      dialogFormVisible: false,
      // 手机品牌信息
      tradeMarkForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则
      rules: {
        // 品牌名验证规则
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        // 图片验证规则
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  mounted() {
    // 获取列表数据
    this.getPageList();
  },
  methods: {
    // 获取品牌列表数据
    async getPageList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.limit = result.data.size;
        this.list = result.data.records;
      }
    },
    // 每页展示数据条数发生变化
    handleSieChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 点击添加，显示对话框
    showDialog() {
      // 清理数据
      this.tradeMarkForm = { tmName: "", logoUrl: "" };
      this.dialogFormVisible = true;
    },
    // 点击修改，显示对话框
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      this.tradeMarkForm = { ...row };
    },
    // 图片上传
    handleAvatarSuccess(res, file) {
      // res上传成功后服务器返回的数据
      this.tradeMarkForm.logoUrl = res.data;
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加按钮（添加或修改品牌）
    addOrUpdateTradeMark() {
      this.$refs.rulerForm.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          // 发请求
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tradeMarkForm
          );
          if (result.code == 200) {
            this.$message({
              message: this.tradeMarkForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            // 根据是否修改选择停在哪一页
            this.getPageList(this.tradeMarkForm.id ? this.page : 1);
          }
        } else {
          console.log("error Submit!!");
          return false;
        }
      });
    },
    // 删除品牌
    deleteTradeMark(row) {
      this.$confirm(`此操作将删除${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getPageList(this.list.length>1?this.page:this.page-1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
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
  border-color: #409eff;
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
