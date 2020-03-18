<template>
  <div class="main-box">    
    <div class="search-area"> <!--      
      <dl>
        <dt>商机状态：</dt>
        <dd>
          <el-checkbox-group v-model="searchForm.businessStatus">
            <el-checkbox-button v-for="state in status" :label="state" :key="state">{{state}}</el-checkbox-button>
          </el-checkbox-group>
        </dd>
      </dl>       -->
      <dl>
        <dt>线索状态：</dt>
        <dd class="search-bar">
          <el-checkbox-group v-model="vModelStatus" @change="changeClueHandle">
            <el-checkbox-button v-for="state in fllowupsStatus" :label="state" :key="state">{{state}}</el-checkbox-button>
          </el-checkbox-group>
          <p class="back-list highblue" @click="backToList">返回名单列表</p>
        </dd>
      </dl>
      <dl>
        <dt>更新时间：</dt>
        <dd>
          <el-date-picker v-model="choseTime" type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          align="right"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          @change="pickerDate">
          </el-date-picker>
        </dd>
      </dl>
      <dl>
        <dt>企业名称：</dt>
        <dd>
          <el-input placeholder="请输入企业名称"
                    v-model="searchForm.entName">
            <!-- <el-button slot="append"
                       icon="el-icon-search"></el-button> -->
          </el-input>
        </dd>
      </dl>
      <div class="companyHandle">
        <p>本次更新<span class="highred">{{curCardList.total}}</span>条</p>
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
                     round @click="moveClueToCardHandle">线索转移</el-button>
          </div>        
          
        </el-popover>
        <!-- <el-popover
          placement="top"
          width="160"
          v-model="visible">
          <p>这是一段内容这是一段内容确定删除吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
          </div>
          <el-button slot="reference">删除</el-button>
        </el-popover>  -->
      </div>
    </div>
    <div class="company-data">
      <el-table ref="listDetailTable"
                :data="curCardList.list"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column label="企业名称" prop="name" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.entName }}</template>
        </el-table-column>
        <el-table-column prop="storageTime"
                         label="领取时间" :formatter="formatDate">
        </el-table-column>
        <el-table-column prop="updateTime"
                         label="最后跟进时间" :formatter="formatDate">
        </el-table-column>
        <el-table-column prop="callStatus"
                         label="线索状态" :formatter="matchClueStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.fllowupStatus == 0">待跟进</span>
            <span v-if="scope.row.fllowupStatus == 1">有意向</span>
            <span v-if="scope.row.fllowupStatus == 2">无意向</span>
            <span v-if="scope.row.fllowupStatus == 3">已成交</span>
            <span v-if="scope.row.fllowupStatus == 4">未成交</span>
          </template>
        </el-table-column>
        <el-table-column prop="address"
                         label="地区"  show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.entName }}</template>
        </el-table-column>
        <el-table-column prop="remark"
                         label="备注">
          <template slot-scope="scope">{{ scope.row.reMark || '--' }}</template>
        </el-table-column>
        <el-table-column prop="clueStatus"
                         label="提醒">
          <template slot-scope="scope">添加提醒</template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="searchForm.pageNum"
                     :page-sizes="[10, 20, 30, 40,50,60,70,80,90,100]"
                     :page-size="searchForm.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="curCardList.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
/*
*API请求接口备注
*searchGetListDetail-请求名单详情列表
*transforserClues 转移线索请求
*/
import {searchGetListDetail,transforserClues} from '@/api/cardmanage'
import {getCurUserCard,getNewComToCard} from '@/api/foundclues'
import {parseToTimestamp,parseTime} from '@/utils/index'
import {getLocalStorage} from '@/utils/index'
export default {
  name: 'CompanyList',  
  created(){//初始化之前先请求当前名单详情列表
    this.curCardId = this.$store.state.cluesmanage.curCardId
    this.fetchListDetail()
    this.fetchCardList()
  },
  watch:{
    searchForm:{
      handler:function(val,oldval){//监听回调
        this.fetchListDetail()
      },
      deep: true //开启深度监听
    }
  },
  props:{
    changeCom:{
      type:Function,
      default:null
    }
  },
  data () {
    return {
      curCardId:'',//当前名单id
      curCardList:[],//当前名单详情列表
      choseTime:[],
      curUserCardList:{},//当前用户的名单列表
      status: ['转线索','已触达', '待触达'],//商机状态
      fllowupsStatus:['待跟进','有意向','无意向','已成交','未成交'],//线索状态,
      vModelStatus:[],
      searchForm:{
        listId: this.$store.state.cluesmanage.curCardId,
        // businessStatus:[],//商机状态
         fllowupStatus:[],//线索状态
        // updateTime:'',//更新时间
        // subAccount:'',// 查询条件-子帐户
        // subAccountList:'',//查询条件-子帐户名单
        startTime:'',
        endTime:'',
        entName:'',//内容搜索
        pageNum:0,
        pageSize:10
      },
      moveClueToCardForm:{
        dataSource:0,
        listId:this.$store.state.cluesmanage.curCardId,
        entId:[]//选取的线索列表
      }
    }
  },
  methods:{
    backToList(){ //返回名单列表组件
      this.changeCom()
      this.fetchCardList()
    },
    fetchListDetail(){ //名单列表数据请求
      searchGetListDetail(this.searchForm).then(response=>{
        try{
          if(response.status==200){
            try{}catch(e){}
            this.curCardList = response.data.obj
            // console.log(this.curCardList)
          }
        }catch(e){}
      })
    },
    fetchCardList(){//获取当前用户名单列表用于线索转移
      getCurUserCard({entUserId:getLocalStorage('userId')}).then(response=>{ 

        this.curUserCardList = response.data.obj
      })
    },
    matchClueStatus(row,column){//表格线索状态列格式化
      let cluesStatus = row.cluesStatus
      switch(cluesStatus) {
       case 0:
          return '待跟进'
          break;
       case 1:
          return '有意向'
          break;
       case 2:
          return '无意向'
          break;
       case 3:
          return '有意向'
          break;
       case 4:
          return '已成交'
          break;
       case 5:
          return '未成交'
          break;
       default:
          return '待跟进'
      } 
    },
    formatDate(row, column, cellValue){//表格时间列格式化时间
      // return cellValue
      return parseTime(cellValue)
    },
    changeClueHandle(val){//将搜索条件线索状态的文字状态转换为对应id
      let cluesArray = []
      for(var i = 0; i < val.length; i++){
        if(this.fllowupsStatus.indexOf(val[i]) >= 0){
          cluesArray.push(this.fllowupsStatus.indexOf(val[i]))
        }
      }
      this.searchForm.fllowupStatus = cluesArray
    },
    handleSelectionChange(val){//选取列表事件监听
      this.moveClueToCardForm.entId = []
      for(let i in val){
        this.moveClueToCardForm.entId.push(val[i].entId)        
      }
    },
    moveClueToCardHandle(){// 转移线索至线索池
      if(this.moveClueToCardForm.entId.length == 0){
        this.$message.error('请选择要转移的线索数据')
      }else{
        transforserClues(this.moveClueToCardForm).then(response=>{
          try{
            if(response.status == 200){
              this.$message.success('线索已转移至名单')
              this.fetchListDetail()//线索转移之后reload列表
            }
          }catch(e){}
        })
      }
    },
    pickerDate(val){//监听时间选取
      this.searchForm.startTime = parseToTimestamp(val[0],10)
      this.searchForm.endTime = parseToTimestamp(val[1],10)
      this.searchForm.fllowupStatus = this.searchForm.fllowupStatus
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
    dd.search-bar{      
      display:flex;
      flex-grow:1;
      flex-direction:row;
      justify-content:space-between;
      p.back-list{
        text-align: center;
        cursor: pointer;
      }
    }
  }  
  div.companyHandle {
    display: flex;
    justify-content: space-between;
  }
}
.el-pagination {
  margin-top: 20px;
}
</style>
