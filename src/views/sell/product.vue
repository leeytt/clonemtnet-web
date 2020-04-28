<template>
  <div class="app-container">
    <div class="head-container">
      <!-- 工具栏 -->
      <div class="toobar">
        <el-form>
          <!-- 搜索 -->
          <el-input
            v-model="query.productName"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            placeholder="输入商品名称搜索"
            class="filter-item"
            style="width: 200px"
            @keyup.enter.native="toQuery"
          />
          <el-select
            v-model="query.productStatus"
            clearable
            size="small"
            placeholder="商品状态"
            class="filter-item"
            style="width: 120px"
            @change="toQuery"
          >
            <el-option
              v-for="item in statusTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <el-button
            type="success"
            size="small"
            class="filter-item"
            icon="el-icon-search"
            @click="toQuery"
          >搜索</el-button>
        </el-form>
      </div>
      <!-- 添加商品 -->
      <div class="add-button">
        <el-button type="primary" size="small" v-if="hasPerm('product:add')" @click="showCreateDialog">添加商品</el-button>
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
        <el-form-item label="商品名" prop="productName">
          <el-input v-model="form.productName" />
        </el-form-item>
        <el-form-item label="单价" prop="productPrice">
          <el-input v-model="form.productPrice" />
        </el-form-item>
        <el-form-item label="库存" prop="productStock">
          <el-input v-model.number="form.productStock" />
        </el-form-item>
        <el-form-item label="图片" prop="productIcon">
          <el-upload
            ref="upload"
            class="upload-wrap"
            action="http://upload-z2.qiniup.com"
            list-type="picture"
            :data="token"
            :limit="limit"
            :on-exceed="handleExceed"
            :before-remove="beforeRemove"
            :on-success="handleSuccess"
            :on-error="handleError"
            :file-list="fileList"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
          >
            <el-button size="small" type="primary">上传图片</el-button>
          </el-upload>
          <img v-if="!file_url" class="img-icon" :src="form.productIcon" alt />
        </el-form-item>
        <el-form-item label="描述" prop="productDescription">
          <el-input v-model="form.productDescription" />
        </el-form-item>
        <el-form-item label="上架">
          <el-switch v-model="form.productStatus" active-color="#13ce66" />
        </el-form-item>
        <el-form-item style="margin-bottom: 0;" label="所属类目">
          <el-select v-model="form.categoryType" style="width: 437px" placeholder="请选择类目">
            <el-option
              v-for="item in categorys"
              :key="item.categoryType"
              :label="item.categoryName"
              :value="item.categoryType"
            />
          </el-select>
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
      <el-table-column align="center" label="商品名称" prop="productName" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="图片" prop="productIcon" width="160">
        <template slot-scope="scope">
          <img class="img-icon" :src="scope.row.productIcon" alt />
        </template>
      </el-table-column>
      <el-table-column align="center" label="单价/元" prop="productPrice" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="描述" prop="productDescription" width="110"></el-table-column>
      <el-table-column align="center" label="所属类目" prop="category.categoryName" width="110"></el-table-column>
      <el-table-column align="center" label="库存" prop="productStock" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="商品是否上架" prop="productStatus" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.productStatus"
            active-color="#13ce66"
            @change="changeStatus(scope.row, scope.row.productStatus)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" width="170"></el-table-column>
      <el-table-column align="center" label="操作" width="130">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            v-if="hasPerm('product:update')"
            @click="showEditDialog(scope.row)"
          ></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" v-if="hasPerm('product:delete')" @click="remove(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="totalCount"
      :current-page="Page.pageNow"
      :page-size="Page.pageSize"
      :page-sizes="[5, 10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 8px;"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "Product",
  data() {
    return {
      list: [], // 表格的数据
      listLoading: false, // 数据加载等待动画
      dialogVisible: false, // dialog打开弹窗的标记
      token: {},
      limit: 1,
      file_url: "",
      fileList: [],
      query: {
        productName: "",
        productStatus: ""
      },
      statusTypeOptions: [
        { key: "true", display_name: "上架" },
        { key: "false", display_name: "下架" }
      ],
      productId: undefined, //商品id
      form: {
        productName: "",
        productIcon: "",
        productPrice: undefined,
        productStock: undefined,
        productDescription: "",
        productStatus: true,
        categoryType: 1
      },
      categorys: [], // 类目列表
      titleMap: {
        // 数据字典
        create: "新增商品",
        edit: "修改商品"
      },
      dialogType: "create",
      rules: {
        productName: [
          { required: true, message: "请输入商品名", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        productPrice: [
          { required: true, message: "请输入单价", trigger: "blur" }
        ],
        productStock: [
          { required: true, message: "请输入库存", trigger: "blur" }
        ]
      },
      totalCount: 0, // 分页组件--数据总条数
      Page: {
        pageNow: 1, // 当前页(页码)
        pageSize: 5, // 每页条数(分页大小)
        desc: true
      }
    };
  },
  created() {
    //获取七牛token
    this.$store.dispatch("upload/getQiniuToken").then(data => {
      this.token = data;
    });
    this.getList();
  },
  methods: {
    getList() {
      // 查询商品列表
      this.listLoading = true;
      const params = this.Page;
      this.$store.dispatch("product/selectProduct", params).then(data => {
        this.listLoading = false;
        this.list = data.list;
        this.totalCount = data.page.totalCount;
      });
    },
    // 表格序号
    getIndex($index) {
      return (this.Page.pageNow - 1) * this.Page.pageSize + $index + 1;
    },
    // 去搜索
    toQuery() {
      if (this.query.productName != "" || this.query.productStatus != "") {
        const params = this.Page;
        if (this.query.productName != "") {
          params.productName = this.query.productName;
        }
        if (this.query.productStatus != "") {
          params.productStatus = this.query.productStatus;
        }
        this.list = [];
        this.$store
          .dispatch("product/selectProduct", params)
          .then(data => {
            this.list = data.list;
            this.totalCount = data.page.totalCount;
          })
          .catch(() => {
            this.list = [];
          });
      } else {
        this.getList();
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
        center: true
      });
    },
    handleSuccess(response, file) {
      this.file_url = response.fileUrl;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleError(err, file, fileList) {
      this.$message.error(`商品图片 ${file.name} 上传失败`);
    },
    handleSizeChange(val) {
      // 改变每页数量
      this.Page.pageSize = val;
      this.handleFilter();
    },
    handleFilter() {
      // 查询事件
      this.Page.pageNow = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      // 改变页码
      this.Page.pageNow = val;
      this.getList();
    },
    // 添加商品
    showCreateDialog() {
      this.dialogType = "create";
      this.dialogVisible = true;
      this.getCategoryList();
    },
    // 修改商品
    showEditDialog(row) {
      this.productId = row.id;
      this.form.productName = row.productName;
      this.form.productIcon = row.productIcon;
      this.form.productPrice = row.productPrice;
      this.form.productStock = row.productStock;
      this.form.productDescription = row.productDescription;
      this.form.productStatus = row.productStatus;
      this.form.categoryType = row.categoryType;
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.getCategoryList();
    },
    // 获取商品类目列表
    getCategoryList() {
      this.$store.dispatch("category/getAll").then(res => {
        this.categorys = res.data;
      });
    },
    // 重置form表单
    resetFrom() {
      this.dialogVisible = false;
      this.form.productName = "";
      this.form.productIcon = "";
      this.form.productPrice = undefined;
      this.form.productStock = undefined;
      this.form.productDescription = "";
      this.form.productStatus = true;
      this.form.categoryType = 1;
    },
    // 提交添加商品
    submitAdd() {
      const params = this.form;
      if (this.file_url != "") {
        params.productIcon = this.file_url;
      }
      this.$store.dispatch("product/addProduct", params).then(res => {
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
    // 提交更新商品信息
    submitUpdate() {
      const params = this.form;
      params.id = this.productId;
      if (this.file_url != "") {
        params.productIcon = this.file_url;
      }
      this.$store.dispatch("product/updateProduct", params).then(res => {
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
            message: data.msg
          });
        }
      });
    },
    // 改变商品状态
    changeStatus(data, val) {
      const params = { id: data.id, productStatus: val };
      this.$confirm(
        "此操作将" +
          (data.productStatus ? "上架" : "下架") +
          "商品：" +
          data.productName +
          "， 是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$store.dispatch("product/updateProduct", params).then(res => {
            if (200 === res.code) {
              this.$notify({
                title: "成功",
                message: val ? "商品已上架" : "商品已下架",
                type: "success"
              });
            } else {
              this.$notify.error({
                title: "错误",
                message: res.msg
              });
            }
          });
        })
        .catch(() => {
          data.productStatus = !data.productStatus;
        });
    },
    remove(row) {
      this.$confirm("确定删除此商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const params = { id: row.id };
        this.$store
          .dispatch("product/removeProduct", params)
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
.toobar {
  padding: 0px 0px 15px 0px;
}
.add-button {
  margin-bottom: 15px;
}

.img-icon {
  width: 120px;
  height: 100px;
  margin: 5px;
}
</style>