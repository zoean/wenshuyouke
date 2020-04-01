<template>
  <div>
    <!-- 上部公司信息展示 -->
    <div class="main-box header-box">
      <el-row>
        <el-col :span="10">
          <p class="back-list highblue" @click="backToList">返回</p>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle">
        <el-col :span="9">
          <h3 class="highblue" :title="cluesinfo.entName">{{ cluesinfo.entName | ellipsis(30) }}
            <svg-icon class="onthouch-outbound" icon-class="onetouchcall" @click="oneTouchCall" />
          </h3>
        </el-col>
        <el-col :span="15" style="text-align: right">
          {{ cluesinfo.legalName }}
          <span>|</span>
          {{ cluesinfo.regDate }}
          <span>|</span>
          {{ Math.floor(cluesinfo.regCapital) }}万元<span></span>
        地址：{{ cluesinfo.address}}
      </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-col :span="2" >
          <div class="callStatus">
            <span class="label-dark-gray" v-if="!cluesinfo.callStatus">未拨打</span>
            <span class="label-blue" v-if="cluesinfo.callStatus == 1">已接通</span>
            <span class="label-red" v-if="cluesinfo.callStatus == 2">未接通</span>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">拨打记录：{{ cluesinfo.lastCallTime || '--' }}</div>
        </el-col>
        <el-col :span="13">
          <div class="grid-content bg-purple">备注：{{ cluesinfo.remark || '--'}}</div>
        </el-col>
        <el-col :span="4" style="text-align: right">
          <el-button type="primary" @click="lastshow">上一条</el-button>
          <el-button type="primary" @click="nextshow">下一条</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <b>线索当前状态：</b>
          <el-select ref="clueStatus" v-model="value" placeholder="修改线索状态" @change="clueedit">
            <el-option v-for="item in statusoptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="12" class="clue-detail-handle">
          <el-select v-model="moveClueToCardForm.listId" placeholder="请选择名单">
          <el-option
            v-for="item in curUserCardList"
            :key="item.id"
            :label="item.listName"
            :value="item.id"
          />
        </el-select>
          <el-button type="primary" size="middle" round @click="moveClueToCardHandle">转移</el-button>
          <el-button type="info" size="middle" round @click="cluedel">删除</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 左下信息展示编辑 -->
    <el-row :gutter="10" class="clue-detail-container">
      <el-col :span="8">
        <div class="main-box">
          <h5 style="display: inline-block;">基本信息</h5>
          <svg-icon class="edit-clue" icon-class="edit" @click="dialogFormVisible = true" />
          <div class="editinfo">
            <div>
              <span>姓名：</span>
              <p>{{ cluesinfo.name }}</p>
            </div>
            <div>
              <span>部门：</span>
              <p>{{ cluesinfo.department }}</p>
            </div>
            <div>
              <span>职务：</span>
              <p>{{ cluesinfo.duties }}</p>
            </div>
          </div>
          <h5>联系方式</h5>
          <div class="editinfo">
            <div>
              <span>联系方式：</span>
              <p>{{ cluesinfo.contact }}</p>
            </div>
            <div>
              <span>微信号：</span>
              <p>{{ cluesinfo.wechat }}</p>
            </div>
            <div>
              <span>邮箱：</span>
              <p>{{ cluesinfo.email }}</p>
            </div>
            <div>
              <span>联系地址：</span>
              <p>{{ cluesinfo.entAddress }}</p>
            </div>
          </div>
          <!-- <div class="gocall"><el-button type="success" round>一键呼叫</el-button></div> -->
          <el-dialog class="editcont" title="修改信息" :visible.sync="dialogFormVisible" @close="closeDialog" width="30%">
            <el-form ref="cluesinfo" :model="cluesinfo">
              <el-form-item label="姓名" :label-width="formLabelWidth">
                <el-input v-model="cluesinfo.name" />
              </el-form-item>
              <el-form-item label="部门" :label-width="formLabelWidth">
                <el-input v-model="cluesinfo.department" />
              </el-form-item>
              <el-form-item label="职务" :label-width="formLabelWidth">
                <el-input v-model="cluesinfo.duties" />
              </el-form-item>
              <el-form-item label="联系方式" :label-width="formLabelWidth">
                <el-input v-model="cluesinfo.contact" />
              </el-form-item>
              <el-form-item label="微信号" :label-width="formLabelWidth">
                <el-input v-model="cluesinfo.wechat" />
              </el-form-item>
              <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="cluesinfo.email" />
              </el-form-item>
              <el-form-item label="联系地址" :label-width="formLabelWidth">
                <el-input v-model="cluesinfo.entAddress" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeDialog">取 消</el-button>
              <el-button class="surebtn" type="primary" @click="clueedit">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-col>
      <!-- 右下跟进 -->
      <el-col :span="16">
        <div class="main-box">
          <el-radio-group v-model="followtype" @change="statusselect">
            <el-radio label border size="medium">全部</el-radio>
            <el-radio label="0" border size="medium">电话</el-radio>
            <el-radio label="1" border size="medium">拜访</el-radio>
            <el-radio label="2" border size="medium">短信</el-radio>
            <el-radio label="3" border size="medium">邮件</el-radio>
            <el-radio label="4" border size="medium">微信</el-radio>
          </el-radio-group>
          <div class="followcont">
            <div>
              <el-dialog title="写跟进" :visible.sync="dialogVisible" width="30%" customClass="customWidth">
                <el-form ref="followadd" label-width="120px">
                  <el-form-item label="跟进方式">
                    <el-select v-model="followadd.followType" placeholder="类型">
                      <el-option label="电话" value="0" />
                      <el-option label="短信" value="1" />
                      <el-option label="邮件" value="2" />
                      <el-option label="微信" value="3" />
                      <el-option label="QQ" value="4" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="跟进状态">
                    <el-select v-model="followadd.followStatus" placeholder="类型">
                      <el-option label="未回复" value="0" />
                      <el-option label="回复拒绝" value="1" />
                      <el-option label="回复预约" value="1" />
                      <el-option label="未接通" value="1" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input v-model="followadd.followContent" type="textarea" />
                  </el-form-item>
                  <el-form-item label="下次跟进时间">
                    <el-date-picker
                      v-model="followadd.nextFollowTime"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%;"
                      value-format="timestamp"
                      :picker-options="expireTimeOption"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button class="surebtn" type="primary" @click="cluefollowadd">保存</el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>
              <el-button @click="dialogVisible = true" slot="reference" type="text" class="add">
                +
                <br />点击添加动态
              </el-button>
            </div>
            <div class="infinite-list beauty-Scroll" style="overflow-y:auto;overflow-x:hidden">
              <el-scrollbar>
                <ul>
                  <li v-for="(clue,i) in followinfos" :key="i" class="infinite-list-item">
                    <h6>{{ clue.followTime }}</h6>
                    <div>{{ clue.followContent }}</div>
                    <p>{{ clue.nextFollowTime }}</p>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <CallForm ref="callModule" :updateClue="detailsinfo" />
  </div>
</template>
<script>
import CallForm from '@/components/CallForm/index' //引入通话表单组件
import { getLocalStorage } from "@/utils/index"
import { getCurUserCard } from "@/api/foundclues"
import { getxPhoneNums } from '@/api/saleslead'
import Vue from 'vue'
let ellipsis = Vue.filter('ellipsis')//引入全局filter
export default {
  name: 'CompanyDetails',
  props:{
    changeCom:{
      type:Function,
      default:null
    }
  },
  components: {
    CallForm
  },
  data() {
    return {
      userId: getLocalStorage("userId"),
      dialogFormVisible: false,
      dialogVisible: false,
      userlist: null,
      visible2: false,
      options: [],
      count: "",
      followtype: "",
      curUserCardList: [],
      statusoptions: [
        {
          value: 0,
          label: "待跟进"
        },
        {
          value: 1,
          label: "有意向"
        },
        {
          value: 2,
          label: "无意向"
        },
        {
          value: 3,
          label: "已成交"
        },
        {
          value: 4,
          label: "未成交"
        }
      ],
      value: "",
      companyId:"",
      cluesinfo: { id: "" },
      followadd: [],
      clueeditinfo: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      followinfos: [],
      formLabelWidth: "100px",
      moveClueToCardForm:{
        dataSource:2,
        listId:'',
        entId: '',//选取的线索列表
        ids:"",
      },
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now()
        }
      }
    }
  },
  created() {
    this.companyId = this.$store.state.myclue.companyId
    this.moveClueToCardForm.entId = this.$store.state.myclue.companyId
    this.detailsinfo()
    this.searchlist()
    this.cluefollowselect()
    this.fetchCardList()
  },
  methods: {
    backToList(){
      this.changeCom()
    },
    oneTouchCall(){
      getxPhoneNums({entId: this.cluesinfo.entId, callType: "call"}).then(response => {
        if(response.data.status == 200){//虚拟号获取成功后开始拨打电话
          // this.$store.commit('callcenter/SET_USERTEL', response.data.obj)//虚拟号赋值给当前user/seat  02103270050
          this.$store.commit('callcenter/SET_USERTEL', 17610100629)
          this.$store.dispatch('callform/setEditType', 'call')
          this.$store.dispatch('callform/toggleClueForm')
          this.$store.dispatch('callform/togglePanel')
          this.$store.dispatch('callcenter/check_in')
          this.$store.dispatch('callcenter/make_call')
        }else{
          this.$message.error(response.message)
        }
      })
      this.$store.dispatch('callform/setCurClueForm', this.cluesinfo)

    },
    moveClueToCardHandle(){
      if(!this.moveClueToCardForm.listId){
        this.$message.error('请选择目标名单')
      }else{
        this.$store
          .dispatch("myclue/cluesedit", this.moveClueToCardForm)
          .then(res => {
            this.nextshow()
          }).catch(error => {
            console.log(error);
          })
      }
    },
    fetchCardList() {
      //获取当前用户名单列表用于线索转移
      getCurUserCard({ entUserId: getLocalStorage("userId") }).then(
        response => {
          this.curUserCardList = response.data.obj;
        }
      );
    },
    detailsinfo() {
      this.companyId = this.$store.state.myclue.companyId
      this.$store
        .dispatch("myclue/cluesdetail", { id: this.companyId })
        .then(res => {
          this.cluesinfo = res.obj
          this.value = res.obj.fllowupStatus
          this.moveClueToCardForm.ids=res.id
        })
        .catch(() => {});
    },
    lastshow() {
      this.last = {userId: getLocalStorage("userId"), id: this.companyId}
      // console.log(this.last)
      // this.id = { id: this.companyId };
      this.$store
        .dispatch("myclue/clueslast", this.last)
        .then(res => {
          if (res.obj.id) {
            this.lastid = res.obj.id
            // console.log(this.lastid)
      	    this.$store.commit('myclue/SET_COMPANYID',this.lastid)
            this.detailsinfo()
            this.cluefollowselect()
          } else {
            this.$message({
              type: "info",
              message: "没有上一条"
            });
          }
        })
        .catch(() => {});
    },
    nextshow() {
      this.next = {userId: getLocalStorage("userId"), id: this.companyId}
      this.$store
        .dispatch("myclue/cluesnext", this.next)
        .then(res => {
          if (res.obj.id) {
            this.lastid = res.obj.id
      	    this.$store.commit('myclue/SET_COMPANYID',this.lastid)
            this.detailsinfo();
            this.cluefollowselect()
          } else {
            this.$message({
              type: "info",
              message: "没有下一条"
            });
          }
        })
        .catch(() => {});
    },
    clueedit() {
      this.clueinfos = {
        name: this.cluesinfo.name,
        entName: this.cluesinfo.entName,
        department: this.cluesinfo.department,
        duties: this.cluesinfo.duties,
        contact: this.cluesinfo.contact,
        wechat: this.cluesinfo.wechat,
        email: this.cluesinfo.email,
        entAddress: this.cluesinfo.entAddress
      };
      this.clueeditinfo = Object.assign(
        this.clueinfos
      );
      this.clueeditinfo.id = this.companyId
      this.clueeditinfo.fllowupStatus = this.value
      this.$store
        .dispatch("myclue/clueedit", this.clueeditinfo)
        .then(res => {
          this.dialogFormVisible = false;
          this.detailsinfo();
        })
        .catch(error => {
          console.log(error);
        });
    },
    searchlist() {
      this.$store
        .dispatch("recycle/selectList", { entUserId: 1 })
        .then(res => {
          this.options = res.obj;
          // console.log(res.obj)
        })
        .catch(() => {});
    },
    closeDialog() {
      this.dialogFormVisible = false;
      this.detailsinfo();
    },
    cluedel() {
      this.$confirm("确认删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // this.id = { id: this.companyId };
          this.$store
            .dispatch("myclue/cluedel", { id: this.companyId, listId: this.value3 })
            .then(res => {})
            .catch(() => {});
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.nextshow()
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    cluetransfer() {
      if (!this.userlist) {
        this.$message({
          type: "info",
          message: "请选择名单!"
        });
      } else {
        this.id = { id: this.companyId };
        this.$store
          .dispatch("myclue/cluetransfer", this.id)
          .then(res => {
            this.dialogFormVisible = false;
            this.nextshow();
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    statusselect() {
      this.cluefollowselect();
    },
    cluefollowselect() {
      this.id = { clueId: this.companyId };
      this.followtype = { followType: this.followtype };
      this.followdata = Object.assign(this.id, this.followtype);
      this.$store
        .dispatch("myclue/cluefollowselect", this.followdata)
        .then(res => {
          this.followinfos = res.obj;
        })
        .catch(error => {
          console.log(error);
        });
    },
    cluefollowadd() {
      this.id = { clueId: this.companyId };
      this.nowtime = { followTime: Date.now() };
      const followinfo = Object.assign(this.id, this.followadd, this.nowtime);
      this.$store
        .dispatch("myclue/cluefollowadd", followinfo)
        .then(res => {
          this.dialogVisible = false;
          this.cluefollowselect()
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
  .back-list{
    cursor:pointer;
    font-size: 16px;
    margin: 0;
  }
  .clue-detail-handle{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    .el-select{
      margin-right: 10px;
    }
  }
  h3{
    margin:0;
  }
  .header-box {
  .el-row {
    margin-bottom: 35px;
    font-size: 14px;
    span {
      margin: 0 15px;
    }
    .el-col-8 {
      span {
        display: inline-block;
        padding: 3px 10px;
        color: #ffffff;
        background: #7fa9ff;
        border-radius: 4px;
        margin: 0 15px 0 0;
        margin-bottom: 10px;
      }
    }
    .el-col-7 {
      padding: 3px 10px;
    }

    button {
      padding: 8px 16px;
      span {
        margin: 0px;
      }
    }
  }
}
.main-box {
  padding: 30px;
  h3 {
    font-size: 24px;
    color: #333;
    display: inline-block;
    .onthouch-outbound{
      color:#F15533;
      margin-left:15px;
      cursor: pointer;
    }
  }
  .editcont {
    .el-input {
      width: 80%;
    }
  }
  .el-select .el-input .el-select__caret {
    display: none;
  }
  .clueStatus {
    width: 120px;
    height: 32px;
    background: linear-gradient(-23deg, #4088ff, #406dff);
    box-shadow: 0px 2px 4px 0px rgba(43, 97, 187, 0.5);
    border-radius: 16px;
  }

  .el-radio {
    margin-right: 8px;
    margin-left: 0 !important;
  }

  h5 {
    color: #407bff;
    font-size: 14px;
    margin-block-start: 0;
    margin-block-end: 0;
  }
  svg {
    float: right;
  }
  .editinfo {
    margin: 23px 0 23px 17px;
    line-height: 56px;
    color: #666;
    font-size: 14px;
    span {
      display: inline-block;
      width: 84px;
      text-align: right;
    }
    p {
      display: inline-block;
      max-width: calc(100% - 84px);
      vertical-align: top;
      line-height: 28px;
    }
  }
  .followcont {
    margin: 26px 0 0 79px;
    border-left: 1px solid #d1d1d3;
    .add {
      width: 98%;
      text-align: center;
      line-height: 24px;
      padding: 39px;
      box-shadow: none;
    }
    .beauty-Scroll {
      .el-scrollbar {
        height: 100%;
      }
      .el-scrollbar__wrap {
        width: calc(100% + 17px);
        height: calc(100% + 17px);
        overflow-y: scroll;
        overflow-x: hidden;
      }
    }
    .infinite-list {
      height: 360px;
      li {
        background: #f7f7f7;
        padding: 10px 30px 4px;
        border-radius: 12px;
        font-size: 14px;
        margin: 0 16px 16px;
        h6 {
          color: #999999;
        }
        div {
          color: #333;
        }
        p {
          color: #28bc47;
          text-align: right;
        }
      }
    }
  }
  .infinite-list {
    height: 400px;
  }
}
.main-box /deep/ .el-radio__inner {
  display: none;
}
.clueStatus /deep/ .el-input__inner {
  border: none;
  background: none;
  color: #fff;
  width: 100%;
  height: 32px;
  text-align: center;
  line-height: 32px;
  padding-left: 0;
  padding-right: 0;
}
.main-box /deep/.el-radio.is-bordered.is-checked {
  border: none;
  background: #6699ff;
}
.main-box /deep/.el-radio.is-bordered.is-checked span {
  color: #fff;
}
.el-radio--medium.is-bordered {
  padding: 12px 20px 0 10px;
}
.edit-clue{
  cursor:pointer;
}
.clue-detail-container{
  margin-top: 20px;
}
</style>
