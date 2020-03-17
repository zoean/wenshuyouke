<template>
  <div>
    <div>
      <!--企业信息展示-->
      <div class="companyinfo">
        <el-row type="flex" justify="end"><button class="editinfo" @click="show=true"><svg-icon icon-class="edit" />&nbsp;&nbsp;编辑企业信息</button></el-row>
        <el-row>
          <el-col :span="6" class="infoboxleft">
            <img :src="this.companyinfo.enterpriseLogo" alt="">
            <h5>{{ companyinfo.enterpriseName }}</h5>
            <div class="companysurvey">
              <div><span>企业人数:</span>{{companyinfo.enterpriseCount}}人</div>
              <div><span>部门数量:</span>{{companyinfo.enterpriseDepartCount}}个</div>
              <div><span>认证情况:</span>{{companyinfo.enterpriseIsAuth = 1 ? "已认证" : "未认证"}}</div>
            </div>
            <button>
              <svg-icon icon-class="certification" />
              &nbsp;&nbsp;企业认证
            </button>
            <p>完成企业认证，获取更多权益</p>
          </el-col>
          <el-col :span="18" class="infoboxright">
            <div><span>企业规模:</span>{{companyinfo.enterpriseScale}}</div>
            <div><span>企业官网:</span>{{companyinfo.enterpeiseWebsite}}</div>
            <div><span>联系电话:</span>{{companyinfo.enterpriseContact}}</div>
            <div><span>主营业务:</span>{{companyinfo.enterpriseBusiness}}</div>
            <div><span>企业简介:</span>{{companyinfo.enterpriseDesc}}</div>
          </el-col>
        </el-row>
      </div>
      <!--下方三个图片-->
      <el-row :gutter="20" class="learnmore">
        <el-col :span="8"><img style="width:100%" src="@/assets/images/home1.png" />
          <h6>智能销售云平台</h6>
          <p @click="router(learnmore)">点击链接更多</p>
        </el-col>
        <el-col :span="8"><img style="width:100%" src="@/assets/images/home2.png" />
          <h6>智能销售云平台</h6>
          <p @click="router(learnmore)">点击链接更多</p>
        </el-col>
        <el-col :span="8"><img style="width:100%" src="@/assets/images/home3.png" />
          <h6>智能销售云平台</h6>
          <p @click="router(learnmore)">点击链接更多</p>
        </el-col>
      </el-row>
    </div>
    <!--编辑企业信息-->
    <div v-show="this.show" class="editbg" @click="show=false"></div>
    <div v-show="this.show" class="editcompany">
      <p>编辑企业信息</p>
     <el-form ref="upload" :model="upload" label-width="90px" :rules="uploadrules" >
        <el-form-item label="企业名称:">
          <el-input v-model="upload.enterpriseName" disabled></el-input>
        </el-form-item>
        <el-form-item label="企业规模:" prop="enterpriseScale">
          <el-select v-model="upload.enterpriseScale" placeholder=" ">
            <el-option label="50万以下" value="50万以下"></el-option>
            <el-option label="50万-100万" value="50万-100万"></el-option>
            <el-option label="100万以上" value="100万以上"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业官网:" prop="enterpeiseWebsite">
          <el-input v-model="upload.enterpeiseWebsite"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="enterpriseContact">
          <el-input v-model="upload.enterpriseContact"></el-input>
        </el-form-item>
        <el-form-item label="主营业务:" prop="enterpriseBusiness">
          <el-input type="textarea" v-model="upload.enterpriseBusiness"></el-input>
        </el-form-item>
        <el-form-item label="企业简介:" prop="enterpriseDesc">
          <el-input type="textarea" v-model="upload.enterpriseDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit" @click="submit" v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
          <el-button class="cancel"  @click="show=false">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { validUsername } from '@/utils/validate'
import { getLocalStorage } from '@/utils/index'
export default {
  name: 'TestTracking',
  data() {
    return {
      fullscreenLoading: false,
      companyinfo:[],
      blackcolor: false,
      show: false,
      upload:{},
      uploadrules: {
        enterpriseScale: [
          { required: true, message: '请选择企业规模', trigger: 'change' }
        ],
        enterpeiseWebsite: [
          { required: true, message: '请填写企业官网', trigger: 'change' }
        ],
        enterpriseContact: [
          { required: true, message: '请填写联系电话', trigger: 'blur' },
          { min: 11, max: 11, message: "请输入正确手机号", trigger: "blur" },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号码"
          }
        ],
        enterpriseBusiness: [
          {  required: true, message: '请填写企业主营业务', trigger: 'change' }
        ],
        enterpriseDesc: [
          { required: true, message: '请填写企业简介', trigger: 'change' }
        ]
      }
    }
  },
  watch: {

  },
  created() {
   this.infoshow()
  },
  methods: {
    router(learnmore) {
      this.$router.push(learnmore.router)
    },
    infoshow(){
      this.$store.dispatch('user/getInfo')
      .then((res) => {
        this.upload = this.companyinfo = res.enterprise
        // window.localStorage.setItem('companyid', res.id)
        this.companyinfo.id=window.localStorage.getItem('userId')
        if(res.enterprise && res.enterprise.enterpriseLogo){
          this.companyinfo.enterpriseLogo = res.enterprise.enterpriseLogo
        }else{
          this.companyinfo.enterpriseLogo = require('@/assets/images/companylogo.png')
        }

      })
      .catch(() => {
      })
    },
    black() {
      this.blackcolor = true
    },
    submit() {
      this.$refs.upload.validate((valid) => {
        if (valid) {
          this.fullscreenLoading = true;
          this.$store.dispatch('company/company', this.upload)
            .then((res) => {
              if(res){
                if(res.status == 200){
                  setTimeout(() => {
                    this.$message({
                      message: '保存成功',
                      type: 'success'
                    });
                    this.fullscreenLoading = false;
                    this.show = false
                  }, 1000);
                  this.infoshow()
                }else{
                  this.$message.error('保存失败');
                  this.fullscreenLoading = false;
                }
              }else{
                this.$message.error('请重新填写');
                this.fullscreenLoading = false;
              }
            })
            .catch(() => {
            })
        } else {
          this.fullscreenLoading = false;
          console.log('error submit!!');
          return false;
        }
      })

    },
  }
}
</script>

<style lang="scss" scoped>
  /*企业信息展示*/
  .companyinfo{
    padding: 24px 0 56px;
    background:#FFF;
    margin-bottom: 16px;
    box-shadow:0px 2px 7px 1px #D3E5FF;
    border-radius:12px;
    .editinfo{
      width:160px;
      height:32px;
      background:linear-gradient(-23deg,#4088FF,#406DFF);
      box-shadow:0px 2px 4px 0px rgba(43,97,187,0.5);
      border-radius:16px;
      border:none;
      line-height: 32px;
      font-size:14px;
      margin-right: 24px;
      color:#FFF;
      cursor: pointer;
    }
    .infoboxleft{
      padding:0 0px 23px;
      border-right:2px solid #E6F0FF;
      text-align: center;
        img{
          width:140px;
          height:140px;
          background:#E6F0FF;
          border-radius:50%;
        }
        h5{
          font-size:24px;
          font-weight:400;
          color:#333;
          padding:33px 0 39px;
          margin-block-start: 0;
          margin-block-end: 0;
        }
        .companysurvey{
          padding-left: 33%;
          text-align: left;
          font-size:14px;
          color:#333;
          line-height: 28px;
          span{
            color:#999;
            margin-right:11px;
          }
        }
        button{
          margin-top:34px;
          width:120px;
          height:32px;
          background:linear-gradient(-23deg,rgba(64,136,255,1),rgba(64,109,255,1));
          box-shadow:0px 2px 4px 0px rgba(43,97,187,0.5);
          border-radius:16px;
          border:none;
          font-size:14px;
          font-family:Microsoft YaHei;
          font-weight:400;
          color:rgba(255,255,255,1);
          line-height: 32px;
          cursor:pointer;
        }
        p{
          margin-top:16px;
          font-size:12px;
          color:#999;
        }
    }
    .infoboxright{
      padding: 85px 80px 20px 62px;
      font-size:14px;
      color:#333;
      line-height: 28px;
      div{
        margin-bottom:20px;
      }
      span{
        color:#999;
        margin-right:11px;
      }
    }
  }
  /*下方图片*/
  .learnmore{
    .el-col{
      position: relative;
      img{
        position: relative;
      }
      h6{
        width: 100%;
        position: absolute;
        font-size:24px;
        text-align: center;
        font-weight:bold;
        color:#FFF;
        top:25%;
      }
      p{
        width: 100%;
        position: absolute;
        font-size:14px;
        text-align: center;
        color:#FFF;
        top:53.75%;
      }
    }

  }
  /*编辑企业*/
  .editbg{
    position: fixed;
    z-index: 100;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background:rgba(0,0,0,0.4);
    cursor: pointer;
  }
  .editcompany{
    width:640px;
    max-height:78vh;
    background:#FFF;
    border-radius:12px;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    z-index: 101;
    .el-form-item{
      margin:0 99px 24px 78px;
      .el-select,.el-input,.el-textarea{
        width: 100%;
        border:1px solid #CCCCCC;
        border-radius: 8px;
        &:focus-within{
          box-shadow:0px 1px 4px 0px #666;
          border:none;
        }
      }
      .el-button{
        width:86px;
        border-radius:20px;
        font-size:16px;
        text-align: center;
        position: absolute;
        right: -70px;
        background:#cdcdcd;
        cursor: pointer;
      }
      .submit{
        right: 20px;
        color:white;
        background: #4088FF;
      }
    }
    p{
      width: 100%;
      line-height: 48px;
      font-size:16px;
      font-family:Microsoft YaHei;
      font-weight:bold;
      color:#4083FF;
      padding-left:39px;
    }
  }
  textarea::-webkit-input-placeholder,input::-webkit-input-placeholder{
    color:#CCC;
  }
  .editcompany /deep/ .el-input__inner{
    border-radius: 8px;
    border:none
  }
  .editcompany /deep/ .el-textarea__inner{
    border-radius: 8px;
    border:none
  }
  .editcompany /deep/ .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
    background-color:#4083FF;
    color: #FFF;
  }
  .editcompany /deep/ .el-form-item__label{
    font-weight: 400;
  }
</style>
