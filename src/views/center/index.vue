<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <el-upload
                :show-file-list="false"
                action="http://upload-z2.qiniup.com"
                :on-success="handleSuccess"
                :on-error="handleError"
                :data="token"
                class="avatar-uploader"
              >
                <img :src="user.headimgUrl ? user.headimgUrl : Avatar" title="点击上传头像" class="avatar" />
              </el-upload>
            </div>
            <ul class="user-info">
              <li>
                <div style="height: 100%">
                  <svg-icon icon-class="login" />登录账号
                  <div class="user-right">{{ user.username }}</div>
                </div>
              </li>
              <li>
                <svg-icon icon-class="user1" />用户昵称
                <div class="user-right">{{ user.nickname }}</div>
              </li>
              <li>
                <svg-icon icon-class="phone" />手机号码
                <div class="user-right">{{ user.phone }}</div>
              </li>
              <li>
                <svg-icon icon-class="email" />用户邮箱
                <div class="user-right">{{ user.email }}</div>
              </li>
              <li>
                <svg-icon icon-class="dept" />所属角色
                <div class="user-right">{{ user.roleName }}</div>
              </li>
              <li>
                <svg-icon icon-class="anq" />安全设置
                <div class="user-right">
                  <a>修改密码</a>
                  <a>修改邮箱</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <!--用户资料-->
        <el-card class="box-card">
          <el-tabs v-model="activeName">
            <el-tab-pane label="用户资料" name="first">
              <el-form
                ref="form"
                :model="form"
                :rules="rules"
                style="margin-top: 10px;"
                size="small"
                label-width="65px"
              >
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="form.nickname" style="width: 35%" />
                  <span style="color: #C0C0C0;margin-left: 10px;">用户昵称不作为登录使用</span>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="form.phone" style="width: 35%;" />
                  <span style="color: #C0C0C0;margin-left: 10px;">手机号码不能重复</span>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="form.sex" style="width: 178px">
                    <el-radio :label="true">男</el-radio>
                    <el-radio :label="false">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label>
                  <el-button
                    :loading="saveLoading"
                    size="mini"
                    type="primary"
                    @click="doSubmit"
                  >保存配置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import store from "@/store";
import { isvalidPhone } from "@/utils/validate";
import Avatar from "@/assets/avatar.png";
export default {
  name: "Center",
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
      Avatar: Avatar,
      activeName: "first",
      saveLoading: false,
      token: {},
      user: {
        username: "",
        nickname: "",
        phone: "",
        email: "",
        roleName: "",
        headimgUrl: ""
      },
      form: {
        nickname: "",
        phone: "",
        sex: false,
        headimgUrl: ""
      },
      rules: {
        nickname: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        phone: [{ required: true, trigger: "blur", validator: validPhone }]
      }
    };
  },
  computed: {
    ...mapGetters(["userId"])
  },
  created() {
    //获取七牛token
    this.$store.dispatch("upload/getQiniuToken").then(data => {
      this.token = data;
    });
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      // 查询用户基本信息
      const params = {};
      params.id = this.userId;
      this.$store.dispatch("user/getUser", params).then(data => {
        this.user.username = data.username;
        this.user.nickname = data.nickname;
        this.user.phone = data.phone;
        this.user.email = data.email;
        this.user.roleName = data.role.roleName;
        this.user.headimgUrl = data.headimgUrl;
        this.form.nickname = data.nickname;
        this.form.phone = data.phone;
        this.form.sex = data.sex;
        this.form.headimgUrl = data.headimgUrl;
      });
    },
    doSubmit() {
      if (this.$refs["form"]) {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.saveLoading = true;
            this.submitUpdateUser();
          }
        });
      }
    },
    // 提交用户信息更新
    submitUpdateUser() {
      const params = this.form;
      params.id = this.userId;
      this.$store
        .dispatch("user/updateUser", params)
        .then(res => {
          this.saveLoading = false;
          this.$notify({
            title: res.msg,
            type: "success",
            duration: 2500
          });
          this.getUserInfo();
        })
        .catch(() => {
          this.saveLoading = false;
        });
    },
    handleSuccess(response, file, fileList) {
      this.user.headimgUrl = response.fileUrl;
      this.form.headimgUrl = response.fileUrl;
      this.submitUpdateUserAvatar(); //修改头像
    },
    // 修改头像
    submitUpdateUserAvatar() {
      const params = this.form;
      params.id = this.userId;
      this.$store
        .dispatch("user/updateUser", params)
        .then(res => {
          this.$notify({
            title: "头像修改成功",
            type: "success",
            duration: 2500
          });
          this.getUserInfo();
        })
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message);
      this.$notify({
        title: msg.message,
        type: "error",
        duration: 2500
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.avatar-uploader-icon {
  font-size: 28px;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%;
}
.user-info {
  padding-left: 0;
  list-style: none;
  li {
    border-bottom: 1px solid #f0f3f4;
    padding: 11px 0;
    font-size: 13px;
  }
  .user-right {
    float: right;

    a {
      color: #317ef3;
    }
  }
}
</style>
