<template>
  <div class="main-box">
    <div class="search-area">      
      <dl>
        <dt>线索来源：</dt>
        <dd>
          <el-checkbox-group v-model="searchForm.dataSource" @change="selectSource">
            <!-- 监听取label的值 模板语法里为显示内容 -->
            <el-checkbox-button v-for="(source,index) in cluesSource" :label="index" :key="source" :value="index">{{source}}</el-checkbox-button>
          </el-checkbox-group>
        </dd>
      </dl>
      <dl>
        <dt>成立时间：</dt>
        <dd>
          <el-date-picker v-model="datePicker" type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          align="right"
                          value-format="timestamp"
                          @change="pickerDate">
          </el-date-picker>
        </dd>
      </dl>
      <dl>
        <dt>查询条件：</dt>
        <dd>
          <template>
            <el-select v-model="searchForm.callStatus"
                       placeholder="请选择">
              <el-option v-for="(item,index) in callStatus"
                         :key="index"
                         :label="item"
                         :value="index">
              </el-option>
              <el-option label="不限"
                         value="">
              </el-option>
            </el-select>
          </template>
        </dd>
        <dd>
          <template>
            <el-select v-model="searchForm.order"
                       placeholder="请选择">
              <el-option v-for="(item,index) in sortType"
                         :key="item"
                         :label="item"
                         :value="index">
              </el-option>
            </el-select>
          </template>
        </dd>
        <dd>
          <el-input v-model="searchForm.entName"></el-input>
        </dd>
      </dl>
      <div class="companyHandle">
        <p>本次更新<b class="highred">{{cluesListObj.total || 0}}</b>条</p>
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
          <el-button slot="reference"
                   type="primary"
                   round @click="moveClueToSelfHandle">线索转移</el-button>
        </div> 
      </div>
    </div>
    <div class="saleslead-data">      
      <el-table ref="multipleTable"
                :data="cluesListObj.list"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column label=""
                         width="170" prop="telephone">
          <template slot-scope="scope">
            <div class="telephone-info">
              <svg-icon class="onthouch-outbound" icon-class="onetouchcall" @click="oneTouchCall(scope.$index, scope.row)" />
              <p class="highblue" @click="fetchUserXphone(scope.row)">点击获取号码</p>
            </div>            
            <!-- <el-button type="success"
                       round
                       >一键呼叫</el-button> -->
          </template>
        </el-table-column>
        <el-table-column prop="cluesListObj.list"
                         label="">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="6">
                <h3 class="highblue" :title="scope.row.entNam">{{scope.row.entName | ellipsis(26)}}<i class="el-icon-edit" title="点击查看/编辑商机" @click="editEntInfo(scope.row)"></i></h3>
              </el-col>
              <el-col :span="2">
                <span class="label-blue" v-if="scope.row.callStatus == 1">{{scope.row.callStatus | callStatus}}</span>
                <span class="label-red" v-else-if="scope.row.callStatus == 2">{{scope.row.callStatus | callStatus}}</span>
                <span class="label-dark-gray" v-else>{{scope.row.callStatus | callStatus}}</span>
              </el-col>
              <el-col :span="4">
                <span><b>拨打次数：</b>{{scope.row.callCount}}</span>
              </el-col>
              <el-col :span="5">
                <span><b>成立时间：</b>{{scope.row.regDateTimestamp | transDateSub}}</span>
              </el-col>
              <el-col :span="3">
                <span><b>法人：</b>{{scope.row.legalName}}</span>
              </el-col>
              <el-col :span="4">
                <span><b>注册资金：</b>{{ Math.floor(scope.row.regCapital)}}万元</span>
              </el-col>
            </el-row>
             <el-row class="com-lable">
              <el-col :span="6">
                <span><b>地址：</b></span>
                <span :title="scope.row.address">{{scope.row.address | ellipsis(30)}}</span>
              </el-col>
              <el-col :span="6">
                <span><b>最近拨打：</b>{{scope.row.lastCallTime | parseDateTime}}</span>
              </el-col>
              <el-col :span="5">
                <span v-show="scope.row.dataSource == 0"><b>商机来源：</b><span class="highblue">新企推荐</span></span>
                <span v-show="scope.row.dataSource == 1"><b>商机来源：</b><span class="highblue">企业搜索</span></span>
                <span v-show="scope.row.dataSource == 2"><b>商机来源：</b><span class="highblue">转线索</span></span>
                <span v-show="scope.row.dataSource == 3"><b>商机来源：</b><span class="highblue">回收站</span></span>
              </el-col>
              <el-col :span="7">
                <span :title="scope.row.remark"><b>备注：</b>{{scope.row.remark | ellipsis(22)}}</span>
              </el-col>
            </el-row> 
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="searchForm.pageNum"
                     :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200]"
                     :page-size="searchForm.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="cluesListObj.total">
      </el-pagination>
    </div>
    <CallForm ref="callModule" :updateClue="fetchCluesList" />
  </div>
</template>
<script>  
/*
@parseToTimestamp 转换为时间戳-截取10位
@parseTime 时间戳转日期
@api-fetchCluesList 请求
@api-postCluesToSelf 转移线索给自己
*/
import Vue from 'vue'
import { mapGetters } from 'vuex'
import {transforserClues} from '@/api/cardmanage'//线索转移接口后改
import {parseToTimestamp, parseTime} from '@/utils/index'
import {getCluesList,postCluesToSelf,updateClues, getxPhoneNums} from '@/api/saleslead'
import {getCurUserCard,getNewComToCard} from '@/api/foundclues'
import {getLocalStorage,cutString} from '@/utils/index'
import CallForm from '@/components/CallForm/index' //引入通话表单组件
let ellipsis = Vue.filter('ellipsis')//引入全局filter
let parseDateTime = Vue.filter('parseDateTime')
export default {
  name: 'CompanyList',
  filters: {    
    transDate(val){
      if(val){
        return parseTime(val)
      }else{
        return '--'
      }      
    },
    callStatus(status){
      switch(status){
        case 1:
          return '已接通'
          break
        case 2:
          return '未接通'
          break
        default: //0
          return '未拨打'
      }
    }
  },
  components: {
    CallForm
  },
  data () {
    return {
      moreForm:false,
      cluesSource: ['新企推荐','企业查询', '转线索','回收站'],
      callStatus:['未拨打','已拨通','未拨通'],
      sortType:['注册资本-升序','注册资本-降序','成立时间-升序','成立时间-降序'],
      fllowupStatus:['待跟进','有意向','无意向','已成交','未成交'],
      datePicker:[],
      curUserCardList:{},//当前用户的名单列表
      cluesListObj:{},//获取到的商机列表
      searchForm:{
        userId:getLocalStorage('userId'),
        dataSource:[],//线索来源
        startTime:'',//更新时间
        endTime:'',// 查询条件-子帐户
        callStatus:'',//商机类型（商机状态）
        order:'',//排序
        entName:'',
        pageNum:0,
        pageSize:10
      },
      curCluesForm:{},
      moveClueToCardForm:{
        dataSource:2,
        listId:this.$store.state.cluesmanage.curCardId,
        ids:[]//选取的线索列表
      },
      moveClueToSelfForm:{
        entId:[]//选取的线索列表
      },
      dropCallForm:{
        called:'',
        extentionno:'',
        clueId:''
      },
      curCluesVisible:false,//呼出后当前线索信息回显dialog
      callDurationVisible:false,//呼叫状态dialog
      callPanelVisible:true,//通话计时
      holdOn:false,//电话是否接通
      time:0,
      timer:null,
      countTime:'正在呼叫中...',
      formTip:'展开更多信息',
    }
  },
  computed: {
    ...mapGetters([
      'telephone'
    ]),
    websocket(){
      return this.$store.state.callcenter.websocket
    }
  },
  created(){
    // this.dropCall() //刷新挂断电话
    this.fetchCluesList()
    this.fetchCardList()//当前登录用户名单列表 
  },
  watch:{//监听搜索条件变化，请求数据
    searchForm:{
      handler:function(val,oldval){//监听回调
        this.fetchCluesList()
      },
      deep: true //开启深度监听
    },
    '$store.state.callcenter.hodeOn':function(val){
      if(val){
        this.holdOn = true
        this.timerStart() 
        this.curCluesForm.callStatus = 2       
      }else{
        this.holdOn = false
        this.timerClear()
        this.countTime = ''
        this.curCluesForm.callStatus = 1 
      }

    }
  },
  methods: {
    formatDate(row, column, cellValue){//表格时间列格式化时间
      // return cellValue
      if(cellValue){
        return parseTime(cellValue)
      }else{
        return '--'
      }
    },
    toggleHeight(){
      this.moreForm = !this.moreForm
      this.formTip = this.moreForm ? '收起' : '展示更多信息'
    },
    timerStart(){      
      this.timer = setInterval(()=>{
        ++this.time
        this.formateTime()
      },1000)
    },
    formateTime(){
      let h = parseInt(this.time / 3600)
      let m = parseInt((this.time - h * 3600) / 60)
      let s = this.time - h * 3600 - m * 60
      // 格式化
      h < 10 ? h = `0${h}` : ''
      m < 10 ? m = `0${m}` : ''
      s < 10 ? s = `0${s}` : ''
      this.countTime = `${h}:${m}:${s}`
    },
    timerClear(){
      this.timer = null
    },
    fetchUserXphone(row){ //获取当前线索虚拟号
      getxPhoneNums({entId: row.entId, callType: "number"}).then(response => {
        if(response.data.status == 200){
          this.$store.dispatch('callform/setEditType', 'fetchxphone')
          this.$store.dispatch('callform/toggleClueForm')
          this.$store.commit('callform/TOGGLE_XPHONE')
          this.$store.commit('callform/SET_XPHONE',response.data.obj)
          this.setCallFormData(row)
          // this.$alert(`您本次获取的虚拟号是：${response.data.obj}，有效时长为3分钟，超时请重新获取`,'获取虚拟号',{
          //   confirmButtonText: '确定',
          //   callback: action => {
          //   }
          // })
        }else{
          this.$message.error(response.data.message)
        }
      })
    },
    setCallFormData(row){
      this.curCluesForm = {
        id:row.id,//线索id
        name: row.name,
        entName:row.entName,//公司名称
        contact:row.contact,//联系方式
        department:row.department,//部门
        duties:row.duties,//职务
        wechat:row.wechat,//微信
        email:row.email,//邮箱
        address:row.address,//地址
        fllowupStatus:row.fllowupStatus || 0,//跟进状态
        dataSource:row.dataSource,//线索来源
        nextFllowupTime:new Date(row.nextFllowupTime),//下次跟进时间
        remark:row.remark,//备注        
        callStatus:2
      }
      this.$store.dispatch('callform/setCurClueForm', this.curCluesForm)
    },
    fetchCardList(){//获取当前用户名单列表用于线索转移
      getCurUserCard({entUserId:getLocalStorage('userId')}).then(response=>{
        this.curUserCardList = response.data.obj
      })
    },
    fetchCluesList(){//获取线索列表
      getCluesList(this.searchForm).then(response=>{
        if(response.data.status==200){
          this.cluesListObj = response.data.obj
        }else{
          this.$message.error(response.data.message)
        }
      })
    },
    selectSource(val){//选择线索来源-将状态处理为状态对应id
      this.searchForm.dataSource = val
    },
    moveClueToCardHandle(){// 转移线索至线索池          
      if(this.moveClueToCardForm.ids.length == 0){
        this.$message.error('请选择要转移的线索数据')
      }else if(this.moveClueToCardForm.listId == ''){
        this.$message.error('请选择要转移的目标名单')
      }else{
        transforserClues(this.moveClueToCardForm).then(response=>{
          if(response.data.status == 200){
            this.$message.success('线索已转移至名单')
            this.fetchCluesList()//线索转移之后reload列表
          }else{
            this.$message.error(response.data.message)
          }
        })
      }
    },
    moveClueToSelfHandle(){//线索转移给自己
      if(this.moveClueToSelfForm.entId.length == 0){
        this.$message.error('请选择要转移的线索数据')
      }else{
        postCluesToSelf(this.moveClueToSelfForm).then(response=>{
            if(response.data.status == 200){
              this.$message.success('线索已转移至线索池')
              this.fetchCluesList()//线索转移之后reload列表
            }else{
              this.$message.error(response.data.message)
            }
        })
      }
    },
    handleSelectionChange(val){//获取标签选取id用于线索转移
      this.moveClueToCardForm.ids = []
      for(let i in val){
        this.moveClueToCardForm.ids.push(val[i].id)   
        this.moveClueToSelfForm.entId.push(val[i].id)     
      }
    },
    editEntInfo(row){ 
      this.$store.dispatch('callform/setEditType', 'edit')//只编辑公司信息不打电话
      this.$store.dispatch('callform/toggleClueForm')//显示表单
      this.setCallFormData(row)
    },
    oneTouchCall (index,row) {//一键呼叫
      // this.$store.commit('callcenter/SET_USERTEL', '13051029868')//传入当前被叫用户手机号码
      if(this.websocket == null){
        this.$store.dispatch('callcenter/websocket_init')
      }
      getxPhoneNums({entId: row.entId, callType: "call"}).then(response => {
        if(response.data.status == 200){//虚拟号获取成功后开始拨打电话
          // this.$store.commit('callcenter/SET_USERTEL', 13661190279)
          this.$store.commit('callcenter/SET_ENTNAME', row.entName)
          this.$store.commit('callcenter/SET_NEWENTID', row.entId)
          this.$store.commit('callcenter/SET_USERTEL', response.data.obj)//虚拟号赋值给当前user/seat
          this.$store.dispatch('callform/setEditType', 'call')
          this.$store.dispatch('callform/toggleClueForm')
          this.$store.dispatch('callform/togglePanel')
          // this.$store.dispatch('callcenter/check_in')
          this.$store.dispatch('callcenter/make_call')
        }else{
          this.$message.error(response.data.message)
        }
      })
      this.setCallFormData(row)
      
    },
    pickerDate(val){
      if(val==null){
        this.searchForm.startTime=this.searchForm.endTime=""
      }
      this.searchForm.startTime = parseToTimestamp(val[0],10)
      this.searchForm.endTime = parseToTimestamp(val[1],10)
    },
    handleSizeChange(pageSize){
      this.searchForm.pageSize = pageSize
    },
    handleCurrentChange(pageNum){
      this.searchForm.pageNum = pageNum
    }
  }
}
</script>
<style lang="scss" scoped>
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
  .companyHandle {
    height: 44px;
    display: flex;
    justify-content: space-between;
    .move-clue-to-card{
      .el-select{
        margin-right:10px;
      }
    }
  }
}
.main-box{
  h3{
    font-size:18px;
    .el-icon-edit{
      padding-left:15px;
      color: #606266;
      cursor: pointer;
    }
  }
}
.add-clues{
  .el-dialog{
    border-radius: 10px;
    .el-dialog__body{
      z-index: 2006;
      overflow-y: scroll;
      overflow-x:hidden; 
    } 
    .el-form{
      .el-form-item{
        .el-form-item__label{
          font-weight:400;
        }
      }
    } 
    .heightAuto{ 
      height: auto;
    }
    .heightShort{     
      height: 19vh;
      overflow: hidden;
    }
    .moreForm{
      padding: 10px 0;
      cursor: pointer;
      text-align: right;
    }
    .el-tips{
      margin-top: 5px;
    }
    .call-duration{
      width: 300px;
      min-height: 200px;
      padding:25px;
      box-shadow: 0 1px 3px rgba(0,0,0,.3);
      border-radius: 10px;
      border-radius: 2px;
      background: #fff;
      position: absolute;
      left:-320px;
      top:0;
      display: flex;
      flex-direction: column;
      align-items: center;
      .el-button{
        width: 200px;
        font-weight: 100;
        color: #fff;
      }
    }
  }  
}
.companyHandle{
  justify-content:space-between;
}
.saleslead-data {  
  .onthouch-outbound{
    font-size: 40px;
    cursor: pointer;
    color: #F15533;
  }
  .telephone-info{
    display: flex;
    flex-direction: row;
    align-items: center;
    p{
      text-align: center;
      cursor: pointer;
      flex-grow: 1;
      cursor:pointer;
    }    
  }
  .el-row {
    display: flex;
    align-items: center;
    .el-col {
      h2 {
        font-size: 24px;
        font-weight: 100;
      }
    }
    .com-tips{
      text-align: right;
      span{
        padding: 0 10px;
      }
    }
    .call-log{
      span{
        padding-right: 18px;
      }
    }
  }
  .com-lable {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    span{
      min-width:52px;
    }
  }
  
}

.add-clues-handle{
  .el-button{
    margin-left: 10px;
  }
}
</style>
