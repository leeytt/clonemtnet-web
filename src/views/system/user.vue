<template>
  <div class="app-container">
    <div class="head-container">
      <!-- 工具栏 -->
      <div class="toobar">
        <el-form>
          <!-- 搜索 -->
          <el-input
            v-model="query.username"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            placeholder="输入名称搜索"
            class="filter-item"
            style="width: 200px"
            @keyup.enter.native="toQuery"
          />
          <el-select
            v-model="query.status"
            clearable
            size="small"
            placeholder="状态"
            class="filter-item"
            style="width: 90px"
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
      <!-- 添加用户 -->
      <div class="add-button" v-if="hasPerm('user:add')">
        <el-button type="primary" size="small" @click="showCreateDialog">新增用户</el-button>
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model.number="form.phone" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex" style="width: 178px">
            <el-radio :label="true">男</el-radio>
            <el-radio :label="false">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否激活">
          <el-switch v-model="form.status" active-color="#13ce66" />
        </el-form-item>
        <el-form-item style="margin-bottom: 0;" label="角色">
          <el-select v-model="form.roleId" style="width: 437px" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
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
      <el-table-column align="center" label="用户名" prop="username" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="昵称" prop="nickname" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="角色" width="105">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>角色: {{ scope.row.role.roleName }}</p>
            <p>描述: {{ scope.row.role.description }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag type="success" v-text="scope.row.role.roleName" v-if="scope.row.roleId===1"></el-tag>
              <el-tag type="info" v-text="scope.row.role.roleName" v-else-if="scope.row.roleId===2"></el-tag>
              <el-tag type="primary" v-text="scope.row.role.roleName" v-else></el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" width="60">
        <template slot-scope="scope">{{ scope.row.sex === true ? '男' : '女' }}</template>
      </el-table-column>
      <el-table-column align="center" label="电话" prop="phone" width="110"></el-table-column>
      <el-table-column align="center" label="邮箱" prop="email" width="160"></el-table-column>
      <el-table-column align="center" label="状态" prop="status" width="70">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            @change="changeStatus(scope.row, scope.row.status)"
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
            v-if="hasPerm('user:update')"
            @click="showEditDialog(scope.$index)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            v-if="hasPerm('user:delete')"
            @click="remove(scope.$index)"
          ></el-button>
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
import { isvalidPhone } from "@/utils/validate";

export default {
  name: "User",
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      list: [], // 表格的数据
      listLoading: false, // 数据加载等待动画
      query: {
        username: "",
        status: ""
      },
      statusTypeOptions: [
        { key: "true", display_name: "激活" },
        { key: "false", display_name: "锁定" }
      ],
      dialogVisible: false, // dialog打开弹窗的标记
      userId: 0, //用户id
      form: {
        username: "",
        phone: "",
        nickname: "",
        email: "",
        sex: "",
        status: true,
        roleId: ""
      },
      roles: [], // 角色列表
      titleMap: {
        // 数据字典
        create: "新增用户",
        edit: "编辑用户"
      },
      dialogType: "create",
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        nickname: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
        ],
        phone: [{ required: true, trigger: "blur", validator: validPhone }]
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
    this.getList();
  },
  methods: {
    getList() {
      // 查询用户列表
      this.listLoading = true;
      this.$store.dispatch("user/selectUser", this.Page).then(data => {
        this.listLoading = false;
        this.list = data.list;
        this.totalCount = data.page.totalCount;
      });
    },
    // 去搜索
    toQuery() {
      if (this.query.username != "" || this.query.status != "") {
        const params = this.Page;
        if (this.query.username != "") {
          params.username = this.query.username;
        }
        if (this.query.status != "") {
          params.status = this.query.status;
        }
        this.list = [];
        this.$store
          .dispatch("user/selectUser", params)
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
    // 新增用户
    showCreateDialog() {
      this.dialogType = "create";
      this.dialogVisible = true;
      this.getRoleList();
    },
    // 编辑用户
    showEditDialog($index) {
      const user = this.list[$index];
      this.userId = user.id;
      this.form.username = user.username;
      this.form.phone = user.phone;
      this.form.nickname = user.nickname;
      this.form.email = user.email;
      this.form.sex = user.sex;
      this.form.status = user.status;
      this.form.roleId = user.roleId;
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.getRoleList();
    },
    // 获取角色列表
    getRoleList() {
      this.$store.dispatch("role/getAll").then(data => {
        this.roles = data.data;
      });
    },
    // 重置form表单
    resetFrom() {
      this.dialogVisible = false;
      this.form.username = "";
      this.form.phone = "";
      this.form.nickname = "";
      this.form.email = "";
      this.form.sex = "";
      this.form.status = true;
      this.form.roleId = "";
    },
    // 提交新增用户
    submitAdd() {
      this.$store.dispatch("user/addUser", this.form).then(data => {
        if (200 === data.code) {
          this.resetFrom();
          this.getList();
          this.$notify({
            title: "添加成功",
            message: "默认密码：123456",
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
    // 提交更新用户
    submitUpdate() {
      const params = this.form;
      params.id = this.userId;
      this.$store.dispatch("user/updateUser", params).then(res => {
        if (200 === res.code) {
          this.resetFrom();
          this.getList();
          this.$notify({
            title: "成功",
            message: "用户信息更新成功",
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
    // 表格序号
    getIndex($index) {
      return (this.Page.pageNow - 1) * this.Page.pageSize + $index + 1;
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
    // 改变状态
    changeStatus(data, val) {
      const params = { id: data.id, status: data.status };
      this.$confirm(
        "此操作将" +
          (data.status ? "激活🔥" : "锁定🔒") +
          "用户：" +
          data.username +
          "， 是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$store.dispatch("user/updateUser", params).then(res => {});
        })
        .catch(() => {
          data.status = !data.status;
        });
    },
    remove($index) {
      this.$confirm("确定删除此用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const user = this.list[$index];
        const params = { id: user.id };
        this.$store
          .dispatch("user/removeUser", params)
          .then(res => {
            if (200 === res.code) {
              this.getList();
              this.$notify({
                title: "成功",
                message: "删除用户成功",
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
</style>
