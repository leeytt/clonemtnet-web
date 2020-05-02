<template>
  <div class="app-container">
    <div class="head-container">
      <!-- 工具栏 -->
      <div class="toobar">
        <el-form>
          <!-- 搜索 -->
          <span class="search-title">订单号：</span>
          <el-input
            v-model="query.orderId"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            placeholder="输入订单号搜索"
            class="filter-item"
            style="width: 200px"
            @keyup.enter.native="toQuery"
          />
          <span class="search-title">姓名：</span>
          <el-input
            v-model="query.buyerName"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            placeholder="输入姓名搜索"
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
          <span class="search-title">订单状态：</span>
          <el-select
            v-model="query.orderStatus"
            clearable
            size="small"
            placeholder="订单状态"
            class="filter-item"
            style="width: 120px"
            @change="toQuery"
          >
            <el-option
              v-for="item in orderStatusTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <span class="search-title">支付状态：</span>
          <el-select
            v-model="query.payStatus"
            clearable
            size="small"
            placeholder="支付状态"
            class="filter-item"
            style="width: 120px"
            @change="toQuery"
          >
            <el-option
              v-for="item in payStatusTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form>
      </div>
    </div>
    <!-- 表格渲染 -->
    <el-table
      :data="list"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      size="small"
      border
      highlight-current-row
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
            <el-table size="small" :data="scope.row.orderDetailList">
              <el-table-column align="center" width="80" property="productId" label="商品ID"></el-table-column>
              <el-table-column align="center" width="120" property="productName" label="商品名称"></el-table-column>
              <el-table-column align="center" width="100" property="productPrice" label="单价/元"></el-table-column>
              <el-table-column align="center" width="100" property="productQuantity" label="数量"></el-table-column>
              <el-table-column align="center" width="100" label="总额/元">
                  <template slot-scope="scope">
                    <span>{{scope.row.productPrice * scope.row.productQuantity}}</span>
                  </template>
              </el-table-column>
            </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单号" prop="orderId" width="160"></el-table-column>
      <el-table-column align="center" label="买家姓名" prop="buyerName" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="手机号" prop="buyerPhone" width="120"></el-table-column>
      <el-table-column
        align="center"
        label="地址"
        prop="buyerAddress"
        width="150"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column align="center" label="订单总金额/元" prop="orderAmount" width="120"></el-table-column>
      <el-table-column align="center" label="订单状态" prop="orderStatus" width="80">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag type="primary" v-if="scope.row.orderStatus===0">新订单</el-tag>
            <el-tag type="info" v-else-if="scope.row.orderStatus===2">已取消</el-tag>
            <el-tag type="success" v-else>已完结</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付状态" prop="payStatus" width="90">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag type="danger" v-if="scope.row.payStatus===0">等待支付</el-tag>
            <el-tag type="success" v-else>支付成功</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式" style="width: 60px;">微信支付</el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" width="170"></el-table-column>
      <el-table-column align="center" label="操作" width="80" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            @click="finish(scope.row)"
            v-if="scope.row.orderStatus===0 && scope.row.payStatus ===1"
          >完结</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="cancel(scope.row)"
            v-if="scope.row.orderStatus===0 && scope.row.payStatus ===0"
          >取消</el-button>
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
  name: "Order",
  data() {
    return {
      list: [], // 表格的数据
      listLoading: false, // 数据加载等待动画
      query: {
        orderId: "",
        buyerName: "",
        orderStatus: "",
        payStatus: ""
      },
      orderStatusTypeOptions: [
        { key: "0", display_name: "新订单" },
        { key: "1", display_name: "已完结" },
        { key: "2", display_name: "已取消" }
      ],
      payStatusTypeOptions: [
        { key: "0", display_name: "等待支付" },
        { key: "1", display_name: "支付成功" }
      ],
      totalCount: 0, // 分页组件--数据总条数
      Page: {
        pageNow: 1, // 当前页(页码)
        pageSize: 10, // 每页条数(分页大小)
        desc: true
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      // 查询订单列表
      this.listLoading = true;
      const params = this.Page;
      this.$store.dispatch("order/selectOrder", params).then(data => {
        this.listLoading = false;
        this.list = data.list;
        this.totalCount = data.page.totalCount;
      });
    },
    // 去搜索
    toQuery() {
      if (
        this.query.orderId != "" ||
        this.query.buyerName != "" ||
        this.query.orderStatus != "" ||
        this.query.payStatus != ""
      ) {
        const params = this.Page;
        if (this.query.orderId != "") {
          params.orderId = this.query.orderId;
        }
        if (this.query.buyerName != "") {
          params.buyerName = this.query.buyerName;
        }
        if (this.query.orderStatus != "") {
          params.orderStatus = this.query.orderStatus;
        }
        if (this.query.payStatus != "") {
          params.payStatus = this.query.payStatus;
        }
        this.list = [];
        this.$store
          .dispatch("order/selectOrder", params)
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
    cancel(row) {
      this.$confirm("确定取消订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const params = { orderId: row.orderId, openid: row.buyerOpenid };
        this.$store
          .dispatch("order/cancelOrder", params)
          .then(res => {
            if (200 === res.code) {
              this.getList();
              this.$notify({
                title: "成功",
                message: "取消订单成功！",
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
            this.$message.error("取消订单失败");
          });
      });
    },
    finish(row) {
      this.$confirm("确定完结订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const params = { orderId: row.orderId, openid: row.buyerOpenid };
        this.$store
          .dispatch("order/finishOrder", params)
          .then(res => {
            if (200 === res.code) {
              this.getList();
              this.$notify({
                title: "成功",
                message: "完结订单成功！",
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
            this.$message.error("完结订单失败");
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
.search-title {
  font-size: 14px;
  color: #97a9bf;
  margin-left: 10px;
}
.add-button {
  margin-bottom: 15px;
}
</style>
