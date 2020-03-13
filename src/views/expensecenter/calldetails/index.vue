<template>
	<div class="main-box">
		<div class="search-area">
			<dl>
				<dt>统计范围：</dt>
				<dd>
					<el-select v-model="searchForm.userId" placeholder="请选择名单">
            <el-option
              v-for="(item,index) in subAccount"
              :key="index.id"
              :label="item.listName"
              :value="item.id">
            </el-option>
          </el-select>
				</dd>
			</dl>
			<dl>
				<dt>时间选择：</dt>
				<dd>
					<el-button type="primary" plain @click="pickerToday">今天</el-button>
					<el-button type="primary" plain @click="pickerThisWeek">一周</el-button>
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
		</div>
		<div class="order-data">
			<el-table ref="listDetailTable"
                :data="orderDetailList.list"
                tooltip-effect="dark"
                style="width: 100%">        
        <el-table-column label="呼叫时间" prop="name">
          <template slot-scope="scope">{{ scope.row.entName }}</template>
        </el-table-column>
        <el-table-column prop="storageTime"
                         label="领取时间" :formatter="formatDate">
        </el-table-column>
        <el-table-column prop="updateTime"
                         label="最后跟进时间"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.lastFollowTime }}</template>
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
                         label="地区">
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
                     :total="orderDetailList.total">
      </el-pagination>
		</div>
	</div>
</template>
<script>
import {getSubAccounts} from '@/api/cardmanage'
import {getCallList} from '@/api/orderdetail'
import {getLocalStorage,parseToTimestamp,beforeToday,beforeAweek} from '@/utils/index'
export default {
	data(){
		return {
			subAccount:[],//当前用户下属子帐户
			choseTime:[],//搜索时间选择
			searchForm:{
				extentionno:'6001',
				pageNum:1,
				pageSize:10
			},
			orderDetailList:{}
		}
	},
	watch:{//监听搜索条件变化，请求数据
    searchForm:{
      handler:function(val,oldval){//监听回调
      	console.log(val)
        this.fetchOrderList()
      },
      deep: true //开启深度监听
    },
    test:{
    	handler:function(val,oldval){
    		console.log(val)
    	}
    }
  },
	created(){		
		getSubAccounts({parentId:getLocalStorage('userId')}).then(response=>{//获取子帐户列表
			try{
				this.subAccount = response.data.obj
			}catch(e){}
		})
	},
	methods:{
		fetchOrderList(){
			getCallList(this.searchForm).then(response => {
				console.log(response)
			})
		},
		pickerDate(val){//时间处理-转时间戳并截取前十位
			this.searchForm.startTime = parseToTimestamp(val[0],10)
    	this.searchForm.endTime = parseToTimestamp(val[1],10)
    	this.fetchOrderList()
		},
		pickerToday(){
			this.searchForm.startTime = parseToTimestamp(beforeToday()[0],10)
    	this.searchForm.endTime = parseToTimestamp(beforeToday()[1],10)
    	this.fetchOrderList()
		},
		pickerThisWeek(){
			this.searchForm.startTime = parseToTimestamp(beforeAweek()[0],10)
    	this.searchForm.endTime = parseToTimestamp(beforeAweek()[1],10)
    	this.fetchOrderList()
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
  dl.backToList{
    text-align: center;
    cursor: pointer;
  }
  div.companyHandle {
    display: flex;
    justify-content: space-between;
  }
}
</style>