<template>
  <div class="app-container">
    <div class="head-container">
      <!-- 工具栏 -->
      <div class="toobar">
        <el-form>
          <!-- 搜索 -->
          <el-input
            v-model="query.roleName"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            placeholder="输入名称搜索"
            class="filter-item"
            style="width: 200px"
            @keyup.enter.native="toQuery"
          />
          <el-button
            type="success"
            size="small"
            class="filter-item"
            icon="el-icon-search"
            @click="toQuery"
          >搜索</el-button>
        </el-form>
      </div>
      <!-- 添加角色 -->
      <div class="add-button">
        <el-button type="primary" size="small" v-if="hasPerm('role:add')" @click="showCreateDialog">新增角色</el-button>
      </div>
    </div>
    <!--表单渲染-->
    <el-dialog
      :close-on-click-modal="false"
      :before-close="resetFrom"
      :visible.sync="dialogVisible"
      :title="titleMap[dialogType]"
      top="120px"
      width="520px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" style="width: 145px;" />
        </el-form-item>
        <el-form-item label="角色权限" prop="status">
          <el-radio-group v-model="form.status" disabled size="small" style="width: 145px;">
            <el-radio-button label="true">全部</el-radio-button>
            <el-radio-button label="false">本级</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input v-model="form.description" style="width: 380px;" rows="5" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" size="small" @click="resetFrom">取消</el-button>
        <el-button type="primary" size="small" v-if="dialogType=='create'" @click="submitAdd">确认</el-button>
        <el-button type="primary" size="small" v-else @click="submitUpdate">更新</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table
            :data="list"
            v-loading.body="listLoading"
            element-loading-text="拼命加载中"
            size="small"
            style="width: 100%;"
            highlight-current-row
            @current-change="handleCurrentChangeMenu"
          >
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                <span v-text="getIndex(scope.$index)"></span>
              </template>
            </el-table-column>
            <el-table-column label="角色名称" prop="roleName" width="100"></el-table-column>
            <el-table-column label="角色权限" prop="status">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag type="success" v-if="scope.row.status===true">全部</el-tag>
                  <el-tag type="primary" v-else>本级</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="描述" prop="description" :show-overflow-tooltip="true" />
            <el-table-column label="创建时间" prop="createTime" width="170"></el-table-column>
            <el-table-column align="center" label="操作" width="130">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  v-if="hasPerm('role:update')"
                  @click="showEditDialog(scope.$index)"
                ></el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  v-if="hasPerm('role:delete')"
                  @click="remove(scope.$index)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
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
        </el-card>
      </el-col>
      <!-- 菜单授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
            >保存</el-button>
          </div>
          <el-tree
            ref="menu"
            :data="menus"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            check-strictly
            accordion
            show-checkbox
            node-key="id"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      list: [], // 表格的数据
      listLoading: false, // 数据加载等待动画
      query: {
        roleName: ""
      },
      dialogVisible: false, // dialog打开弹窗的标记
      showButton: false, //保存菜单分配
      menuLoading: false, //保存加载动画
      menus: [], //菜单树
      menuIds: [], //默认选择的菜单
      currentId: 0, //当前选中的角色id
      defaultProps: {
        label: "menuName",
        children: "children"
      },
      titleMap: {
        // 数据字典
        create: "新增角色",
        edit: "编辑角色"
      },
      dialogType: "create",
      roleId: 0, //角色id
      form: {
        roleName: "",
        description: "",
        status: false
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        status: [{ required: true, message: "请输入角色权限", trigger: "blur" }]
      },
      totalCount: 0, // 分页组件--数据总条数
      Page: {
        pageNow: 1, // 当前页(页码)
        pageSize: 5 // 每页条数(分页大小)
      }
    };
  },
  created() {
    this.getList();
    this.getTree();
  },
  methods: {
    getList() {
      // 查询角色列表
      this.listLoading = true;
      this.$store.dispatch("role/selectRole", this.Page).then(data => {
        this.listLoading = false;
        this.list = data.list;
        this.totalCount = data.page.totalCount;
      });
    },
    // 获取菜单树
    getTree() {
      this.$store.dispatch("menu/selectMenuTree").then(data => {
        this.menus = data.list;
      });
    },
    // 触发单选
    handleCurrentChangeMenu(val) {
      if (val) {
        const _this = this;
        // 清空菜单的选中
        this.$refs.menu.setCheckedKeys([]);
        // 保存当前的角色id
        this.currentId = val.id;
        // 初始化
        this.menuIds = [];
        // 菜单数据需要特殊处理
        val.permissionList.forEach(function(data, index) {
          _this.menuIds.push(data.id);
        });
        this.showButton = true;
      }
    },
    // 保存菜单
    saveMenu() {
      this.menuLoading = true;
      const role = { id: this.currentId, menus: [] };
      // 得到半选的父节点数据，保存起来
      this.$refs.menu.getHalfCheckedNodes().forEach(function(data, index) {
        // const menu = { id: data.id }
        role.menus.push(data.id);
      });
      // 得到已选中的 key 值
      this.$refs.menu.getCheckedKeys().forEach(function(data, index) {
        // const menu = { id: data }
        role.menus.push(data);
      });
      this.$store.dispatch("menu/updateMenuTree", role).then(data => {
        if (200 === data.code) {
          this.menuLoading = false;
          this.$notify({
            title: "保存成功",
            message: data.msg,
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
    // 去搜索
    toQuery() {
      if (this.query.roleName != "") {
        const params = this.Page;
        params.roleName = this.query.roleName;
        this.list = [];
        this.$store
          .dispatch("role/selectRole", params)
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
    // 新增角色
    showCreateDialog() {
      this.dialogType = "create";
      this.dialogVisible = true;
    },
    // 提交新增角色
    submitAdd() {
      this.$store.dispatch("role/addRole", this.form).then(data => {
        if (200 === data.code) {
          this.resetFrom();
          this.getList();
          this.$notify({
            title: "添加成功",
            message: data.msg,
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
    // 编辑角色
    showEditDialog($index) {
      const role = this.list[$index];
      this.roleId = role.id;
      this.form.roleName = role.roleName;
      this.form.description = role.description;
      this.form.status = role.status;
      this.dialogType = "edit";
      this.dialogVisible = true;
    },
    // 提交更新角色
    submitUpdate() {
      const params = this.form;
      params.id = this.roleId;
      this.$store.dispatch("role/updateRole", params).then(res => {
        if (200 === res.code) {
          this.resetFrom();
          this.getList();
          this.$notify({
            title: "成功",
            message: "角色信息更新成功",
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
    // 重置form表单
    resetFrom() {
      this.dialogVisible = false;
      this.form.roleName = "";
      this.form.description = "";
      this.form.status = false;
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
    remove($index) {
      this.$confirm("确定删除此角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const role = this.list[$index];
        const params = { id: role.id };
        this.$store
          .dispatch("role/removeRole", params)
          .then(res => {
            if (200 === res.code) {
              this.getList();
              this.$notify({
                title: "成功",
                message: "删除角色成功",
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