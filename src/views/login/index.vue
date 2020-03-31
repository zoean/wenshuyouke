<template>
  <div class="login-container">
    <el-form ref="loginForm"
             :model="loginForm"
             :rules="loginRules"
             class="login-form"
             auto-complete="on"
             label-position="left">
      <div class="logo">
        <img width="250" src="@/assets/images/logo.png" />
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username"
                  v-model="loginForm.username"
                  placeholder="登录名"
                  name="username"
                  type="text"
                  tabindex="1"
                  autocomplete="off" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="密码"
                  name="password"
                  tabindex="2"
                  auto-complete="on"
                  @keyup.enter.native="handleLogin" />
        <span class="show-pwd"
              @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-row type="flex" justify="end">
        <el-col :span="20">
          <!-- <el-checkbox>下次自动登录</el-checkbox> -->
        </el-col>
        <el-col :span="4">
          <a class="forget-pw">忘记密码</a>
        </el-col>
      </el-row>
      <el-row type="flex"
              justify="space-between">
        <el-col :span="10">
          <el-button class="btn-md-general"
                     :loading="loading"
                     type="primary"
                     style="width:100%;margin-bottom:30px;"
                     @click.native.prevent="handleLogin">登陆</el-button>
        </el-col>
        <el-col :span="10">
          <router-link :to="{path:'/regester'}">
            <el-button class="btn-md-grey">注册</el-button>
          </router-link>
        </el-col>
      </el-row>
      <el-row type="flex"
              justify="center">
        <!-- <el-col :span="8">
          <a>手机验证码登录</a>
        </el-col>
        <el-col :span="8"><a>微信扫码登录</a></el-col> -->
      </el-row>

      <!-- <div class="tips">
        <span style="margin-right:20px;">username: zzt</span>
        <span> password: 1</span>
      </div>
      <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: 1</span>
      </div>
      <div class="tips">
        <span style="margin-right:20px;">username: thomas</span>
        <span> password: 1</span>
      </div> -->
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";

export default {
  name: "Login",
  data () {
    const validateUsername = (rule, value, callback) => {
      if (validUsername(value)) {
        callback(new Error("请输入登录名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd () {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleRegester(){      
      this.$router.push({path:this.redirect})
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              // this.$store.dispatch('callcenter/websocket_init')
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
              reslove()
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #fff;
$light_gray: #fff;
$cursor: #ccc;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  padding-top: -64px;
  .el-input {
    display: inline-block;
    height: 47px;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 35px;
      color: #ccc;
      height: 47px;
      caret-color: $cursor;
      border-bottom: 1px solid #ccc;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: url("~@/assets/images/bg.png") center top;
$dark_gray: #889aa4;

$light_gray: #eee;

.login-container {
  min-height: 100%;
  background: $bg;
  margin: 0 auto;
  overflow: hidden;

  .login-form {
    background: url("~@/assets/images/login.png") center 0 no-repeat;
    position: relative;
    width: 992px;
    height: 672px;
    margin: 122px auto 0;
    overflow: hidden;
    .logo {
      margin: 128px 0 120px 560px;
    }
    .el-form-item {
      width: 367px;
      height: 48px;
      margin: 50px 0 10px 518px;
      color: #999;
      position: relative;
      .el-input {
        width: 100%;
      }
    }
    .el-row {
      width: 367px;
      margin: 0 0 46px 518px;
      .forget-pw {
        text-align: right;
        color: #1170ff;
        font-size: 14px;
      }
      .el-checkbox {
        color: #999;
      }
    }
  }

  .login-btn {
    width: 200px !important;
    height: 48px;
    border-radius: 24px;
    font-size: 20px;
    padding: 0;
    border: 0;
    background: linear-gradient(to bottom, #4088ff 0%, #406dff 100%);
    box-shadow: 0px 2px 4px #3366cc;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 20px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
