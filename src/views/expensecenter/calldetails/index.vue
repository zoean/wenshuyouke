<template>
	<div class="main-box">
		<div class="search-area">
			<dl>
				<dt>统计范围：</dt>
				<dd>
					<el-select v-model="searchForm.extentionno" placeholder="请选择名单">
            <el-option
              v-for="(item,index) in subAccount"
              :key="index.id"
              :label="item.realName"
              :value="item.extentionno">{{item.realName}}
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
                style="width: 100%" align="center">
        <el-table-column prop="storageTime"
                         label="坐席名称" width="100px">
                         <template slot-scope="scope">{{ scope.row.workno }}</template>
        </el-table-column>   
        <el-table-column prop="storageTime"
                         label="坐席号码" width="100px">
                         <template slot-scope="scope">{{ scope.row.extentionno }}</template>
        </el-table-column>     
        <el-table-column prop="updateTime"
                         label="主呼叫号码" width="120px">
          <template slot-scope="scope">{{ scope.row.caller }}</template>
        </el-table-column>
        <el-table-column label="呼叫时间" prop="starttime" :formatter="formatDate" width="160px">
        </el-table-column>
        <el-table-column prop="connecttime"
                         label="接通呼叫时间" :formatter="formatDate" width="160px">
        </el-table-column>
        <el-table-column prop="endtime"
                         label="结束呼叫时间" :formatter="formatDate" width="160px">
        </el-table-column>
        <el-table-column prop="address"
                         label="通话时长" width="120px">
          <template slot-scope="scope">{{ scope.row.timelen }}s</template>
        </el-table-column>
        <el-table-column prop="address"
                         label="通话录音">
          <template slot-scope="scope">
            <audio v-if="scope.row.recordfilename" width="100" :src="scope.row.recordfilename" controls="controls"></audio>
            <span v-else>--</span>
          </template>
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
import {getLocalStorage,parseToTimestamp,beforeToday,beforeAweek,parseTime,parseDateTime} from '@/utils/index'
export default {
	data(){
		return {
			subAccount:[],//当前用户下属子帐户
			choseTime:[],//搜索时间选择
			searchForm:{
				extentionno:'6002',
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
    }
  },
	created(){	
		getSubAccounts({parentId:getLocalStorage('userId')}).then(response=>{//获取子帐户列表
			try{
				this.subAccount = response.data.obj
			}catch(e){}
		})
    this.fetchOrderList()
	},
	methods:{
    formatDate(row, column, cellValue){//表格时间列格式化时间
      // return cellValue
      if(cellValue){
        return parseDateTime(cellValue)
      }else{
        return '--'
      }
    },
		fetchOrderList(){
			getCallList(this.searchForm).then(response => {
				try{
          this.orderDetailList = response.data.obj
        }catch(e){}
			})
		},
		pickerDate(val){//时间处理-转时间戳并截取前十位
			this.searchForm.startTime = parseToTimestamp(val[0],10)
    	this.searchForm.endTime = parseToTimestamp(val[1],10)
    	this.fetchOrderList()
		},
		pickerToday(){
			this.searchForm.endTime = parseToTimestamp(beforeToday()[0],10)
    	this.searchForm.startTime = parseToTimestamp(beforeToday()[1],10)
    	this.fetchOrderList()
		},
		pickerThisWeek(){
      console.log(parseTime(parseToTimestamp(beforeAweek()[0],10)))
      console.log(parseTime(parseToTimestamp(beforeAweek()[1],10)))
			this.searchForm.endTime = parseToTimestamp(beforeAweek()[0],10)
    	this.searchForm.startTime = parseToTimestamp(beforeAweek()[1],10)
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