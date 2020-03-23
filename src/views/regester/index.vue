<template>
  <div class="regester-container">
    <div class="regester-wrap">
      <el-form>
        <el-form-item class="mb40">
          <el-input placeholder="请输入手机号" value="" v-model="form.tel" class="input-with-select input-tel" type="tel">
          </el-input>
        </el-form-item>
        <el-form-item class="mb40">
          <el-input v-model="form.vcode" placeholder="请输入右侧验证码" value="887" />
          <img :src="codeImg" @click="changeCode" />
        </el-form-item>
        <!-- <el-form-item>
          <el-input placeholder="请输入短信验证码" value="787" />
          <el-button class="btn-20048-general">获取验证码</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-checkbox v-model="form.accept">我已阅读并接受《文投优客用户协议》</el-checkbox>
        </el-form-item>
        <el-form-item class="mt80">
          <el-button :disable="!form.accept" class="btn-54048-general">确认提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Regester',
  data () {
    return {
      form:{
        tel:'',
        vcode:'',
        accept:false
      },
      codeImg:'http://192.168.10.108:8000/user/auth/getCode'
    }
  },
  methods:{
    changeCode(){
      this.codeImg = `${this.codeImg}?${Math.random()}`
    }
  }
}
</script>
<style lang="scss">
.regester-container {
  width: 100%;
  min-height: 500px;
  overflow: hidden;
  background: url('~@/assets/images/bg.png') center top;
  .regester-wrap {
    width: 1236px;
    height: 836px;
    margin: 122px auto 0;
    // padding: 240px 0 0 352px;
    background: url('~@/assets/images/regester.png') center top;
    overflow: hidden;
    .el-form {
      width: 550px;
      height: 500px;
      margin: 254px 0 0 352px;
      .el-form-item {
        width: 100%;
        height: 52px;
        margin-bottom: 0;
        position: relative;
        .el-form-item__content {
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          .el-input-group__prepend {
            width: 92px;
            border: 0;
            // border-right: 1px solid #ccc;
            background: #fff;
          }
          .el-input {
            width: 306px;
            .el-input__suffix-inner {
              border-right: 1px solid #ccc;
              padding-right: 6px;
            }
            input {
              border: 0;
              border-bottom: 1px solid #ccc;
              border-radius: 0;
            }
          }
          .input-tel {
            input {
              width: 300px;
            }
          }
          .el-select {
            width: 100px;
            .el-input {
              width: 100px;
              input {
                width: 100px;
              }
            }
          }
        }
      }
      .mb40 {
        margin-bottom: 40px;
      }
      .mt80 {
        margin-top: 80px;
      }
    }
  }
}
</style>
