<template>
  <div class="regester-container">
    <div class="regester-wrap">
      <el-form>
        <el-form-item class="mb40">
          <el-input placeholder="请输入手机号" value="136" class="input-with-select input-tel" type="tel">
            <el-select slot="prepend" value="1" placeholder="+86">
              <el-option label="+86" value="1" />
              <el-option label="000" value="2" />
              <el-option label="111" value="3" />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item class="mb40">
          <el-input placeholder="请输入右侧验证码" value="887" />
          <img src="@/assets/images/avater.png" />
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入短信验证码" value="787" />
          <el-button class="btn-20048-general">获取验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox>我已阅读并接受《文投优客用户协议》</el-checkbox>
        </el-form-item>
        <el-form-item class="mt80">
          <el-button class="btn-54048-general">确认提交</el-button>
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

    }
  },
  created () {
    this.$store.dispatch('user/userGetVcode')
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
