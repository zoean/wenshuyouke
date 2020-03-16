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
            <el-select v-model="searchForm.clueStatus"
                       placeholder="请选择">
              <el-option v-for="(item,index) in clueStatus"
                         :key="index"
                         :label="item"
                         :value="index">
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
        <p>本次更新<span class="highred">{{cluesListObj.total || 0}}</span>条，更新时间为12-02</p>
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
        <el-table-column label="号码"
                         width="180" prop="telephone">
          <template slot-scope="scope">
            <el-button type="success"
                       round
                       @click="oneTouchCall(scope.$index, scope.row)">一键呼叫</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="cluesListObj.list"
                         label="名片">
                         
          <template slot-scope="scope">
            <el-row>
              <el-col :span="18">
                <h2 class="highblue">{{scope.row.entName}}</h2>
              </el-col>
              <el-col :span="6" class="com-tips">
                <span>{{scope.row.legalName}}</span>|
                <span>{{scope.row.regDateTimestamp}}</span>|
                <span>{{ Math.floor(scope.row.regCapital)}}万元</span>
              </el-col>
            </el-row>
            <div class="com-lable">
              <span>
                <span class="label-blue" >地址</span>
                <span :title="scope.row.address">{{scope.row.address | ellipsis}}</span>
              </span>
              <span class="label-dark-gray" v-show="scope.row.callStatus==0 || !scope.row.callStatus">未拨打</span>
              <span class="label-blue" v-show="scope.row.callStatus==1">已接通</span>
              <span class="label-red" v-show="scope.row.callStatus==2">未接通</span>
              <span class="label-light-gray">拨打记录：{{scope.row.lastCallTime || '--'}}</span>
              <span class="label-light-gray">来源：新企推荐</span>
              <span class="label-light-gray">备注：这里是备注</span>
            </div>
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
    <el-dialog class="add-clues highblue"
               title="新增线索"
               :visible.sync="curCluesVisible"
               :modal="true"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :showClose="false"
               :model="curCluesForm"          
               width="600px">
       <div class="call-duration" v-show="callPanelVisible">
         <h2 class="call-company highblue">{{curCluesForm.entName}}</h2>
        <p class="call-company-duration">{{countTime}}</p>        
        <el-button type="danger"
                   round @click="dropCall">挂断</el-button>
       </div>
      <el-form label-width="120px" :class="moreForm ?'heightAuto':'heightShort'">
        <el-form-item label="公司名称：" prop="entName">
          <el-input v-model="curCluesForm.entName"
                    placeholder="请输入公司名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="curCluesForm.name"
                    placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="telePhone">
          <el-input v-model="curCluesForm.telePhone" type="tel"
                    placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="部门：" prop="department">
          <el-input v-model="curCluesForm.department"
                    placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="职务：" prop="chargeMan">
          <el-input v-model="curCluesForm.chargeMan"
                    placeholder="请输入职务"></el-input>
        </el-form-item>
        <el-form-item label="微信号：" prop="wechat">
          <el-input v-model="curCluesForm.wechat"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="curCluesForm.email"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="地址：" prop="address">
          <el-input v-model="curCluesForm.address"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="跟进状态：" prop="fllowupStatus">
          <el-select v-model="curCluesForm.fllowupStatus">
            <el-option v-for="(item,index) in fllowupStatus" :value="index" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线索来源：" prop="dataSource">
          <el-input v-model="curCluesForm.dataSource"
                    placeholder="请输入内容" disabled>{{cluesSource[curCluesForm.dataSource]}}</el-input>
        </el-form-item>
        <el-form-item label="下次跟进时间：" prop="nextFllowupTime">
          <el-input v-model="curCluesForm.nextFllowupTime"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="curCluesForm.remark" prop="remark"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="end">
        <el-col :span="4" class="moreForm highblue"><span @click="toggleHeight">展开更多信息</span></el-col>
      </el-row>
      <el-row type="flex"
              justify="end" class="add-clues-handle">
        <el-col :span="6">
          <el-button size="middle"
                     type="info"
                     round :disabled="callPanelVisible" @click="cancleEditForm">取消</el-button>         
    <el-button slot="reference" @click="visible = !visible">手动激活</el-button>
  </el-popover>
        </el-col>
        <el-col :span="4">
          <el-button size="middle"
                     type="primary"
                     round @click="saveCluseForm">保存</el-button>
        </el-col>
      </el-row>        
      <el-row type="flex" justify="end" class="el-tips">
        <el-col :span="14"></el-col>
        <el-col :span="10">
          <el-alert
            title="通话结束前无法关闭表单"
            type="warning"
            show-icon :closable="false" v-show="callPanelVisible">
          </el-alert>
        </el-col>
      </el-row>    
    </el-dialog>
  </div>
</template>
<script>  
/*
@parseToTimestamp 转换为时间戳-截取10位
@parseTime 时间戳转日期
@api-fetchCluesList 请求
@api-postCluesToSelf 转移线索给自己
*/
import {transforserClues} from '@/api/cardmanage'
import {parseToTimestamp, parseTime} from '@/utils/index'
import {getCluesList,postCluesToSelf,updateClues} from '@/api/saleslead'
import {getCurUserCard,getNewComToCard} from '@/api/foundclues'
import {getLocalStorage,cutString} from '@/utils/index'
export default {
  name: 'CompanyList',
  filters: {
    ellipsis (str) {
      if(str.length*2 <= 22) {
        return str
    }
    var strlen = 0
    var s = ""
    for(var i = 0;i < str.length; i++) {
        s = s + str.charAt(i)
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2
            if(strlen >= 22){
                return s.substring(0,s.length-1) + "..."
            }
        } else {
            strlen = strlen + 1
            if(strlen >= 22){
                return s.substring(0,s.length-2) + "..."
            }
        }
    }
    return s
    }
  },
  data () {
    return {
      moreForm:false,
      cluesSource: ['新企推荐','企业查询', '转线索','回收站'],
      clueStatus:['已拔通','未拔通','空号'],
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
        clueStatus:'',//商机类型（商机状态）
        order:'',//排序
        entName:'',
        pageNum:0,
        pageSize:10
      },
      curCluesForm:{},
      moveClueToCardForm:{
        dataSource:2,
        listId:this.$store.state.cluesmanage.curCardId,
        entId:[]//选取的线索列表
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
      countTime:'正在呼叫中...'
    }
  },
  mounted(){
    if(this.holdOn){
      console.log('已经刷新但通话在继续')
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
    fetchCardList(){//获取当前用户名单列表用于线索转移
      getCurUserCard({entUserId:getLocalStorage('userId')}).then(response=>{
        this.curUserCardList = response.data.obj
      })
    },
    fetchCluesList(){//获取线索列表
      getCluesList(this.searchForm).then(response=>{
        try{
          if(response.status==200){
            this.cluesListObj = response.data.obj
          }
        }catch(e){}
      })
    },
    selectSource(val){//选择线索来源-将状态处理为状态对应id
      this.searchForm.dataSource = val
    },
    moveClueToCardHandle(){// 转移线索至线索池          
      if(this.moveClueToCardForm.entId.length == 0){
        this.$message.error('请选择要转移的线索数据')
      }else if(this.moveClueToCardForm.listId == ''){
        this.$message.error('请选择要转移的目标名单')
      }else{
        transforserClues(this.moveClueToCardForm).then(response=>{
          try{
            if(response.status == 200){
              this.$message.success('线索已转移至名单')
              this.fetchCluesList()//线索转移之后reload列表
            }
          }catch(e){}
        })
      }
    },
    moveClueToSelfHandle(){//线索转移给自己
      if(this.moveClueToSelfForm.entId.length == 0){
        this.$message.error('请选择要转移的线索数据')
      }else{
        postCluesToSelf(this.moveClueToSelfForm).then(response=>{
          try{
            if(response.status == 200){
              this.$message.success('线索已转移至线索池')
              this.fetchCluesList()//线索转移之后reload列表
            }
          }catch(e){

          }
        })
      }
    },
    handleSelectionChange(val){//获取标签选取id用于线索转移
      this.moveClueToCardForm.entId = []
      for(let i in val){
        this.moveClueToCardForm.entId.push(val[i].entId)   
        this.moveClueToSelfForm.entId.push(val[i].id)     
      }
    },
    oneTouchCall (index,row) {//一键呼叫
      this.curCluesVisible = true
      this.callPanelVisible = true
      this.callDurationVisible = true
      // this.$store.commit('callcenter/SET_USERTEL', row.telePhone || '17610100629')//传入当前被叫用户手机号码
      this.$store.commit('callcenter/SET_USERTEL', row.telePhone)
      this.curCluesForm = {
        id:row.id,//线索id
        entName:row.entName,//公司名称
        contact:row.contact,//联系方式
        department:row.department,//部门
        duties:row.duties,//职务
        wechat:row.wechat,//微信
        email:row.email,//邮箱
        address:row.address,//地址
        fllowupStatus:row.fllowupStatus || 0,//跟进状态
        dataSource:row.dataSource,//线索来源
        nextFllowupTime:row.nextFllowupTime,//下次跟进时间
        remark:row.remark,//备注        
        callStatus:2
      }

      this.$store.dispatch('callcenter/check_in')
      this.$store.dispatch('callcenter/make_call')
    },
    dropCall(){//挂断   
      this.curCluesForm.lastCallTime = new Date().getTime()   
      this.$store.dispatch('callcenter/drop_call')
      this.callPanelVisible = false//隐藏通话计时
    },
    cancleEditForm(){ //
      this.curCluesVisible = false
    },
    saveCluseForm(){//保存当前线索信息      
      updateClues(this.curCluesForm).then(response=>{
        try{
          if(response.status == 200){
            this.curCluesVisible =  false
            this.fetchCluesList()
            this.$message.success('当前线索更新成功')            
          }
        }catch(e){
          this.$message.success('线索更新失败')
        }
      })
    },
    pickerDate(val){
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
  .companyHandle {
    display: flex;
    justify-content: space-between;
  }
}
.saleslead-data {  
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
    }
    .el-tips{
      margin-top: 5px;
    }
    .call-duration{
      width: 300px;
      height: 200px;
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
      }
    }
  }  
}
.add-clues-handle{
  .el-button{
    margin-left: 10px;
  }
}
.el-pagination {
  margin-top: 20px;
}
</style>
