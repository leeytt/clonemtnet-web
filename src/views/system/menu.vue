<template>
  <div class="app-container">
    <div class="head-container">
      <!-- 添加菜单 -->
      <div class="add-button">
        <el-button type="primary" size="small" v-if="hasPerm('menu:add')" @click="showCreateDialog">新增菜单</el-button>
      </div>
      <!--表单渲染-->
      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :before-close="resetFrom"
        :visible.sync="dialogVisible"
        :title="titleMap[dialogType]"
        top="120px"
        width="580px"
      >
        <el-form
          ref="form"
          :inline="true"
          :model="form"
          :rules="rules"
          size="small"
          label-width="80px"
        >
          <el-form-item label="菜单类型" prop="type">
            <el-radio-group v-model="form.type" size="mini" style="width: 200px">
              <el-radio-button label="0">目录</el-radio-button>
              <el-radio-button label="1">菜单</el-radio-button>
              <el-radio-button label="2">按钮</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="form.type.toString() === '0'" label="目录名称" prop="menuName">
            <el-input v-model="form.menuName" placeholder="目录名称" style="width: 178px;" />
          </el-form-item>
          <el-form-item v-show="form.type.toString() === '1'" label="菜单名称" prop="menuName">
            <el-input v-model="form.menuName" placeholder="菜单名称" style="width: 178px;" />
          </el-form-item>
          <el-form-item v-show="form.type.toString() === '2'" label="按钮名称" prop="menuName">
            <el-input v-model="form.menuName" placeholder="按钮名称" style="width: 178px;" />
          </el-form-item>
          <el-form-item label="路由地址" v-show="form.type.toString() !== '2'" prop="menuCode">
            <el-input v-model="form.menuCode" placeholder="路由地址" style="width: 178px;" />
          </el-form-item>
          <el-form-item v-show="form.type.toString() !== '2'" label="菜单图标" prop="icon">
            <el-popover
              placement="bottom-start"
              width="450"
              trigger="click"
              @show="$refs['iconSelect'].reset()"
            >
              <IconSelect ref="iconSelect" @selected="selected" />
              <el-input
                slot="reference"
                v-model="form.icon"
                style="width: 450px;"
                placeholder="点击选择图标"
                readonly
              >
                <svg-icon
                  v-if="form.icon"
                  slot="prefix"
                  :icon-class="form.icon"
                  class="el-input__icon"
                  style="height: 32px;width: 16px;"
                />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="上级菜单" prop="parentId">
            <treeselect
              v-model="form.parentId"
              :options="menus"
              :normalizer="normalizer"
              style="width: 450px;"
              placeholder="选择上级菜单"
            />
          </el-form-item>
          <el-form-item label="权限标识" prop="permissionCode">
            <el-input
              v-model="form.permissionCode"
              :disabled="form.type.toString() === '0' ? true : false"
              placeholder="权限标识"
              style="width: 178px;"
            />
          </el-form-item>
          <el-form-item label="权限名称" prop="permissionName">
            <el-input
              v-model="form.permissionName"
              :disabled="form.type.toString() === '0' ? true : false"
              style="width: 178px;"
              placeholder="匹配的权限名称"
            />
          </el-form-item>
          <el-form-item label="菜单排序" prop="sort">
            <el-input-number
              v-model.number="form.sort"
              :min="0"
              :max="999"
              size="small"
              controls-position="right"
              style="width: 178px;"
            />
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
        ref="table"
        :data="list"
        v-loading.body="listLoading"
        element-loading-text="拼命加载中"
        size="small"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="id"
      >
        <el-table-column label="菜单名称" prop="menuName" width="125px" :show-overflow-tooltip="true" />
        <el-table-column align="center" label="图标" prop="icon" width="60px">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序" prop="sort">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="路由地址" prop="menuCode" :show-overflow-tooltip="true" />
        <el-table-column label="权限标识" prop="permissionCode" :show-overflow-tooltip="true" />
        <el-table-column label="权限名称" prop="permissionName" :show-overflow-tooltip="true" />
        <el-table-column align="center" label="菜单类型" prop="type" width="75px">
          <template slot-scope="scope">
            <span v-if="scope.row.type===0">目录</span>
            <span v-else-if="scope.row.type===1">菜单</span>
            <span v-else>按钮</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" width="170"></el-table-column>
        <el-table-column align="center" label="操作" width="130">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              v-if="hasPerm('menu:update')"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              v-if="hasPerm('menu:delete')"
              @click="remove(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import IconSelect from "@/components/IconSelect";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Menu",
  components: {
    IconSelect,
    Treeselect
  },
  data() {
    return {
      list: [], // 表格的数据
      menus: [], // 菜单树
      normalizer(node) {
        return {
          id: node.id,
          label: node.menuName,
          children: node.children
        };
      },
      listLoading: false, // 数据加载等待动画
      totalCount: 0, // 菜单总条数
      dialogVisible: false, // dialog打开弹窗的标记
      titleMap: {
        // 数据字典
        create: "新增",
        edit: "修改"
      },
      dialogType: "create",
      menuId: 0, //菜单id
      form: {
        parentId: 0,
        menuCode: "",
        menuName: "",
        icon: "",
        type: 0,
        sort: 999,
        permissionCode: "",
        permissionName: "",
        requiredPermission: false
      },
      rules: {
        menuName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        menuCode: [
          { required: true, message: "请输入路由地址", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      // 查询菜单列表
      this.listLoading = true;
      this.$store.dispatch("menu/selectMenuTree").then(data => {
        this.listLoading = false;
        this.list = data.list;
        this.totalCount = data.totalCount;
      });
    },
    // 获取菜单树
    getTree() {
      this.$store.dispatch("menu/selectMenuTree").then(data => {
        this.menus = [];
        const menu = { id: 0, menuName: "根菜单", children: [] };
        menu.children = data.list;
        this.menus.push(menu);
      });
    },
    // 新增菜单
    showCreateDialog() {
      this.dialogType = "create";
      this.dialogVisible = true;
      this.getTree();
    },
    // 提交新增菜单
    submitAdd() {
      const params = this.form;
      this.$store.dispatch("menu/addMenu", params).then(data => {
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
    // 编辑菜单
    showEditDialog(row) {
      this.getTree();
      const menu = row;
      this.menuId = menu.id;
      this.form.parentId = menu.parentId;
      this.form.menuCode = menu.menuCode;
      this.form.menuName = menu.menuName;
      this.form.icon = menu.icon;
      this.form.type = menu.type;
      this.form.sort = menu.sort;
      this.form.permissionCode = menu.permissionCode;
      this.form.permissionName = menu.permissionName;
      this.form.requiredPermission = menu.requiredPermission;
      this.dialogType = "edit";
      this.dialogVisible = true;
    },
    // 提交更新菜单
    submitUpdate() {
      const params = this.form;
      params.id = this.menuId;
      this.$store.dispatch("menu/updateMenu", params).then(res => {
        if (200 === res.code) {
          this.resetFrom();
          this.getList();
          this.$notify({
            title: "成功",
            message: "菜单信息修改成功",
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
      this.form.parentId = 0;
      this.form.menuCode = "";
      this.form.menuName = "";
      this.form.icon = "";
      this.form.type = 0;
      this.form.sort = 999;
      this.form.permissionCode = "";
      this.form.permissionName = "";
      this.form.requiredPermission = false;
    },
    // 选中图标
    selected(name) {
      this.form.icon = name;
    },
    remove(row) {
      this.$confirm("确定删除此菜单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const menu = row;
        const params = { id: menu.id };
        this.$store
          .dispatch("menu/removeMenu", params)
          .then(res => {
            if (200 === res.code) {
              this.getList();
              this.$notify({
                title: "成功",
                message: "删除菜单成功",
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