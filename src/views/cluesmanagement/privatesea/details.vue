<template>
  <div>
    <!-- 上部公司信息展示 -->
    <div class="main-box header-box">
      <el-row>
        <h3>{{ cluesinfo.entName }}</h3>
        <el-select ref="clueStatus" v-model="value" placeholder="请选择" @change="clueedit" class="clueStatus">
          <el-option
            v-for="item in statusoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-row>
      <el-row>
        {{ cluesinfo.legalName }}<span> | </span>{{ cluesinfo.regDate }}<span> | </span>{{ parseInt(cluesinfo.regCapital) }} 万元
      </el-row>
      <el-row>
        <el-col :span="10" type="flex" justify="space-between"><div><span>地址</span>{{ cluesinfo.address }}</div><div>{{ cluesinfo.callStatus }}</div></el-col>
        <el-col :span="7"><div class="grid-content bg-purple-light">拨打记录：{{ cluesinfo.lastCallTime }}</div></el-col>
        <el-col :span="7"><div class="grid-content bg-purple">备注：{{ cluesinfo.remark }}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-button type="primary" @click="lastshow">上一条</el-button>
          <el-button type="primary" @click="nextshow">下一条</el-button>
          <el-dialog title="线索转移" :visible.sync="dialogFormVisible">
            <p>将选择的线索转移到其他用户的线索中</p>
            <el-form-item label="用户名">
              <el-select v-model="userlist" placeholder="请选择用户名">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.listName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <div slot="footer" class="dialog-footer">
             <el-button @click="dialogFormVisible = false">取 消</el-button>
             <el-button type="primary" @click="cluetransfer">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
        <el-col :span="12" style="text-align: right;" class="clue-handle">
          <div class="move-clue-to-card">
          <el-select v-model="moveClueToCardForm.listId" placeholder="请选择名单">
            <el-option
              v-for="(item,index) in curUserCardList"
              :key="index.id"
              :label="item.listName"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button slot="reference"
                   type="primary"
                   round @click="moveClueToCardHandle">转移</el-button>
          <el-button type="info" round @click="cluedel">删除</el-button>
        </div>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="10" class="con-wrap" type="flex" justify="space-between">
    <!-- 左下信息展示编辑 -->
      <el-col :span="8">
        <div class="main-box">
          <h5 style="display: inline-block;">基本信息</h5><svg-icon icon-class="edit" @click="dialogFormVisible = true" />
          <div class="editinfo">
            <div><span>姓名：</span><p>{{ cluesinfo.name }}</p></div>
            <div><span>部门：</span><p>{{ cluesinfo.department }}</p></div>
            <div><span>职务：</span><p>{{ cluesinfo.duties }}</p></div>
          </div>
          <h5>联系方式</h5>
          <div class="editinfo">
            <div><span>联系方式：</span><p>{{ cluesinfo.telePhone }}</p></div>
            <div><span>微信号：</span><p>{{ cluesinfo.wechat }}</p></div>
            <div><span>邮箱：</span><p>{{ cluesinfo.email }}</p></div>
            <div><span>联系地址：</span><p>{{ cluesinfo.entAddress }}</p></div>
          </div>
          <el-dialog class="editcont" title="修改信息" :visible.sync="dialogFormVisible" @close='closeDialog'>
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
                <el-input v-model="cluesinfo.telePhone" />
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
            <div slot="footer" class="dialog-footer btns">
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
            <el-radio label="" border size="medium">全部</el-radio>
            <el-radio label="0" border size="medium">电话</el-radio>
            <el-radio label="1" border size="medium">拜访</el-radio>
            <el-radio label="2" border size="medium">短信</el-radio>
            <el-radio label="3" border size="medium">邮件</el-radio>
            <el-radio label="4" border size="medium">微信</el-radio>
          </el-radio-group>
          <div class="followcont">
            <div>
              <el-dialog
              title="写跟进"
                :visible.sync="dialogVisible"
                width="400"
                customClass="customWidth"
              >
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
                    <el-date-picker v-model="followadd.nextFollowTime" type="date" placeholder="选择日期" style="width: 100%;" value-format="timestamp" />
                  </el-form-item>
                  <el-form-item class="btns">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button class="surebtn" type="primary" @click="cluefollowadd">保存</el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>
               <el-button  @click="dialogVisible = true" slot="reference" type="text" class="add">+<br>点击添加动态</el-button>
            </div>
            <div class="infinite-list beauty-Scroll" style="overflow-y:auto;overflow-x:hidden">
              <el-scrollbar>
                <ul>
                  <li v-for="(clue,i) in followinfos" class="infinite-list-item"><h6>{{ clue.followTime }}</h6><div>{{ clue.followContent }}</div><p>{{ clue.nextFollowTime }}</p></li>
                </ul>
              </el-scrollbar>
            </div>

          </div>
        </div>

      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getLocalStorage } from '@/utils/index'
import {getCurUserCard} from '@/api/foundclues'
import {transforserClues} from '@/api/cardmanage'
export default {
  name: 'CompanyList',
  data() {
    return {
      dialogFormVisible: false,
      dialogVisible: false,
      userlist: null,
      visible2: false,
      options: [],
      count: '',
      followtype: '',
      statusoptions: [{
        value: '0',
        label: '有意向'
      }, {
        value: '1',
        label: '无意向'
      }, {
        value: '2',
        label: '已成交'
      }, {
        value: '3',
        label: '未成交'
      }, {
        value: '4',
        label: '待更新'
      }],
      value: '',
      cluesinfo: { id: '' },
      followadd: [],
      clueeditinfo: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      followinfos: [],
      formLabelWidth: '100px',
      moveClueToCardForm:{
        dataSource:2,
        listId:'',
      },
      curUserCardList:[]
    }
  },
  created() {
    this.detailsinfo()
    this.searchlist()
    this.cluefollowselect()
    this.fetchCardList()
  },
  methods: {
    moveClueToCardHandle(){
      this.moveClueToCardForm.listId = new Array(this.moveClueToCardForm.listId)
      transforserClues(this.moveClueToCardForm).then(response=>{
        try{
          if(response.status == 200){
            this.$message.success('线索已转移成功')
            this.nextshow()
            this.moveClueToCardForm.listId = ''
          }
        }catch(e){}
      })
    },
    fetchCardList(){//获取当前用户名单列表用于线索转移
      getCurUserCard({entUserId:getLocalStorage('userId')}).then(response=>{
        this.curUserCardList = response.data.obj
      })
    },
    a(cluesinfo) {
      this.followinfos = cluesinfo
    },
    detailsinfo() {
      this.id = { id: this.$route.query.id }
      this.$store.dispatch('myclue/cluesdetail', this.id)
        .then((res) => {
          this.cluesinfo = res.obj
        })
        .catch(() => {
        })
    },
    lastshow() {
      this.id = { id: this.$route.query.id }
      this.$store.dispatch('myclue/clueslast', this.id)
        .then((res) => {
          if (res.obj.id) {
            this.$router.replace({
              path: 'details',
              query: {
                id: res.obj.id
              }
            })
            this.detailsinfo()
          } else {
            this.$message({
              type: 'info',
              message: '没有上一条'
            })
          }
        })
        .catch(() => {
        })
    },
    nextshow() {
      this.id = { id: this.$route.query.id }
      this.$store.dispatch('myclue/cluesnext', this.id)
        .then((res) => {
          if (res.obj.id) {
            this.$router.replace({
              path: 'details',
              query: {
                id: res.obj.id
              }
            })
            this.detailsinfo()
          } else {
            this.$message({
              type: 'info',
              message: '没有下一条'
            })
          }
        })
        .catch(() => {
        })
    },
    clueedit() {
      this.id = { id: this.$route.query.id }
      this.clueStatus = { clueStatus: this.value }
      this.clueinfos = { name: this.cluesinfo.name, entName: this.cluesinfo.entName, department: this.cluesinfo.department, duties: this.cluesinfo.duties, contact: this.cluesinfo.contact, wechat: this.cluesinfo.wechat, email: this.cluesinfo.email }
      this.clueeditinfo = Object.assign(this.id, this.clueStatus, this.clueinfos)
      this.$store.dispatch('myclue/clueedit', this.clueeditinfo)
        .then((res) => {
          this.dialogFormVisible = false
          this.detailsinfo()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    searchlist() {
      this.$store.dispatch('recycle/selectList', { 'entUserId': 1 })
        .then((res) => {
          this.options = res.obj
          // console.log(res.obj)
        })
        .catch(() => {
        })
    },
    closeDialog(){
      this.dialogFormVisible = false
      this.detailsinfo()
    },
    cluedel() {
      this.$confirm('确认删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.id = { id: this.$route.query.id }
        this.$store.dispatch('myclue/cluedel', { 'id': this.id, 'listId': this.value3 })
          .then((res) => {
          })
          .catch(() => {
          })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.nextshow()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    cluetransfer() {
      if (!this.userlist) {
        this.$message({
          type: 'info',
          message: '请选择名单!'
        })
      } else {
        this.id = { id: this.$route.query.id }
        this.$store.dispatch('myclue/cluetransfer', this.id)
          .then((res) => {
            this.dialogFormVisible = false
            this.nextshow()
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    statusselect() {
      this.cluefollowselect()
    },
    cluefollowselect() {
      this.id = { clueId: this.$route.query.id }
      this.followtype = { followType: this.followtype }
      this.followdata = Object.assign(this.id, this.followtype)
      this.$store.dispatch('myclue/cluefollowselect', this.followdata)
        .then((res) => {
          this.followinfos = res.obj
        })
        .catch((error) => {
          console.log(error)
        })
    },
    cluefollowadd() {
      this.id = { clueId: this.$route.query.id }
      this.nowtime = { followTime: Date.now() }
      const followinfo = Object.assign(this.id, this.followadd, this.nowtime)
      this.$store.dispatch('myclue/cluefollowadd', followinfo)
        .then((res) => {
          this.dialogVisible = false
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
<style lang="scss">
.search-area {
  display: flex;
  flex-direction: column;
  dl {
    display: flex;
    flex-direction: row;
    align-items: center;
    dd {
      margin-left: 10px;
    }
  }
  div.companyHandle {
    display: flex;
    justify-content: flex-end;
  }
}
.clue-handle{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  .move-clue-to-card{
    display: flex;
    flex-direction: row;
  }
}

.header-box{
  .el-row{
    margin-bottom: 35px;
    font-size:14px;
    span{
      margin:0 15px
    }
    .el-col-10{
      span{
        display: inline-block;
        padding: 3px 10px;
        color: #FFFFFF;
        background: #7FA9FF;
        border-radius:4px;
        margin:0 15px 0 0
      }
    }
    .el-col-7{
      padding: 3px 10px;
    }
    button{
      span{
        margin:0px
      }
    }
  }
}
.el-pagination {
  margin-top: 20px;
}
.con-wrap{
  display: flex;
  margin-top:20px;
  align-items: stretch;
}
.main-box{
  padding:30px;
  h3{
    font-size:24px;
    color: #333;
    display: inline-block;
  }
  .editcont{
    .el-input{
      width: 80%;
    }
  }
  .el-select .el-input .el-select__caret{
    display: none;
  }
  .clueStatus{
    width:120px;
    height:32px;
    background:linear-gradient(-23deg,#4088FF,#406DFF);
    box-shadow:0px 2px 4px 0px rgba(43,97,187,0.5);
    border-radius:16px;
  }

  .el-radio{
    margin-right: 8px;
    margin-left: 0!important;
  }
  .el-dialog{
    width: 500px;
    border-radius:12px;
    span{
      color: #4083FF;
      font-size:16px;
      font-weight: bold;
    }
    label{
      width: 120px!important;
      text-align: right;
      font-weight: 400;
      font-size:14px;
      color: #666;
    }
    .el-textarea,.el-select,.el-date-editor{
      width: calc( 100% - 40px)!important;
    }
    .btns{
      text-align: right;
      button{
        box-shadow:0px 2px 4px 0px rgba(43,97,187,0.5);
      }
      .surebtn{
        background:linear-gradient(-23deg,#4088FF,#406DFF);
        span{
          color: #FFF;
        }
      }
    }
  }
  h5{
    color: #407BFF;
    font-size:14px;
    margin-block-start: 0;
    margin-block-end: 0;
  }
  svg{
    float: right;
  }
  .editinfo{
    margin:23px 0 23px 17px;
    line-height:56px;
    color: #666;
    font-size:14px;
    span{
      display: inline-block;
      width: 84px;
      text-align: right;
    }
    p{
      display: inline-block;
      max-width: calc(100% - 84px);
      vertical-align: top;
      line-height: 28px;
    }
  }
  .followcont{
    margin:26px 0 0 79px;
    border-left:1px solid #D1D1D3;
    .add{
      width: 98%;
      text-align: center;
      line-height: 24px;
      padding:39px;
      box-shadow: none;
    }
    .beauty-Scroll{
        .el-scrollbar{
            height: 100%;
        }
        .el-scrollbar__wrap {
            width: calc(100% + 17px);
            height: calc(100% + 17px);
            overflow-y: scroll;
            overflow-x: hidden;
        }
    }
    .infinite-list{
      height: 330px;
      li{
        background: #F7F7F7;
        padding:10px 30px 4px;
        border-radius:12px;
        font-size:14px;
        margin:0 16px 16px;
        h6{
          color: #999999;
        }
        div{
          color: #333;
        }
        p{
          color: #28BC47;
          text-align: right;
        }
      }

    }
  }
  .infinite-list{
    height: 400px;
  }
}

.main-box /deep/ .el-radio__inner{
  display: none;
}
.clueStatus /deep/ .el-input__inner{
  border: none;
  background: none;
  color: #FFF;
  width: 100%;
  height: 32px;
  text-align: center;
  line-height: 32px;
  padding-left: 0;
  padding-right: 0;
}
.main-box /deep/.el-radio.is-bordered.is-checked span{
color: #FFF;
}
.el-radio--medium.is-bordered{
  padding:12px 20px 0 10px
}

</style>
