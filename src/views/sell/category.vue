<template>
  <div class="app-container">
    <div class="head-container">
      <!-- 添加商品类目 -->
      <div class="add-button">
        <el-button
          type="primary"
          size="small"
          v-if="hasPerm('category:add')"
          @click="showCreateDialog"
        >新增类目</el-button>
      </div>
    </div>
    <!--表单渲染-->
    <el-dialog
      :close-on-click-modal="false"
      :before-close="resetFrom"
      :visible.sync="dialogVisible"
      :title="titleMap[dialogType]"
      top="120px"
      width="570px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="68px"
      >
        <el-form-item label="类目名称" prop="categoryName" label-width="100">
          <el-input v-model="form.categoryName" />
        </el-form-item>
        <el-form-item label="编号" prop="categoryType">
          <el-input v-model.number="form.categoryType" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" size="small" @click="resetFrom">取消</el-button>
        <el-button type="primary" size="small" v-if="dialogType=='create'" @click="submitAdd">确认</el-button>
        <el-button type="primary" size="small" v-else @click="submitUpdate">更新</el-button>
      </div>
    </el-dialog>
    <!-- 表格渲染 -->
    <el-table
      :data="list"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      size="small"
      border
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类目名称" prop="categoryName" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="编号" prop="categoryType" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" width="170"></el-table-column>
      <el-table-column align="center" label="操作" width="130">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            v-if="hasPerm('category:update')"
            @click="showEditDialog(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            v-if="hasPerm('category:delete')"
            @click="remove(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      list: [], // 表格的数据
      listLoading: false, // 数据加载等待动画
      dialogVisible: false, // dialog打开弹窗的标记
      titleMap: {
        // 数据字典
        create: "新增类目",
        edit: "编辑类目"
      },
      dialogType: "create",
      categoryId: undefined,
      form: {
        categoryName: "",
        categoryType: undefined
      },
      rules: {
        categoryName: [
          { required: true, message: "请输入类目名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        categoryType: [
          { required: true, message: "请输入类目编号", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      // 商品类目list
      this.listLoading = true;
      this.$store.dispatch("category/getAll").then(data => {
        this.listLoading = false;
        this.list = data.data;
      });
    },
    // 表格序号
    getIndex($index) {
      return $index + 1;
    },
    // 新增类目
    showCreateDialog() {
      this.dialogType = "create";
      this.dialogVisible = true;
    },
    // 修改类目
    showEditDialog(row) {
      this.categoryId = row.id;
      this.form.categoryName = row.categoryName;
      this.form.categoryType = row.categoryType;
      this.dialogType = "edit";
      this.dialogVisible = true;
    },
    // 重置form表单
    resetFrom() {
      this.dialogVisible = false;
      this.form.categoryName = "";
      this.form.categoryType = undefined;
    },
    // 提交新增类目
    submitAdd() {
      const params = this.form;
      this.$store.dispatch("category/addCategory", params).then(res => {
        if (200 === res.code) {
          this.resetFrom();
          this.getList();
          this.$notify({
            title: "成功",
            message: res.msg,
            type: "success"
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: res.msg
          });
        }
      });
    },
    // 提交更新类目
    submitUpdate() {
      const params = this.form;
      params.id = this.categoryId;
      this.$store.dispatch("category/updateCategory", params).then(res => {
        if (200 === res.code) {
          this.resetFrom();
          this.getList();
          this.$notify({
            title: "成功",
            message: res.msg,
            type: "success"
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: res.msg
          });
        }
      });
    },
    remove(row) {
      this.$confirm("确定删除此商品类目?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const params = { id: row.id };
        this.$store
          .dispatch("category/removeCategory", params)
          .then(res => {
            if (200 === res.code) {
              this.getList();
              this.$notify({
                title: "成功",
                message: res.msg,
                type: "success"
              });
            } else {
              this.$notify.error({
                title: "错误",
                message: res.msg
              });
            }
          })
          .catch(() => {
            this.$message.error("删除失败");
          });
      });
    }
  }
};
</script>

<style scoped>
.add-button {
  margin-bottom: 15px;
}
</style>