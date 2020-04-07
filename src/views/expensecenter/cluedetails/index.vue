<template>
	<div class="main-box">
		<div class="search-area">
			<dl>
				<dt>时间选择：</dt>
				<dd>
          <el-button type="primary" plain @click="noLimit">不限</el-button>
					<el-button type="primary" plain @click="pickerToday">今天</el-button>
					<el-button type="primary" plain @click="pickerThisWeek">一周</el-button>
					<el-date-picker v-model="choseTime" type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          align="right"
                          @change="pickerDate">
          </el-date-picker>
				</dd>
			</dl>
		</div>
    <div class="companyHandle">
      当前有<b class="highred">{{clueDetailList.total}}</b>条线索明细
    </div>
		<el-table ref="clueDetailList"
              :data="clueDetailList"
              tooltip-effect="dark"
              style="width: 100%">        
      <el-table-column label="日期" prop="receiveTime">
      </el-table-column>
      <el-table-column  label="操作">
         <template slot-scope="scope">企业管理员  —>  {{ scope.row.listName }} ({{ scope.row.userName }})</template>
      </el-table-column>
      <el-table-column prop="receiveCount" label="领取数" >
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="searchForm.pageNum"
                   :page-sizes="[10, 20, 30, 40, 50, 60,70,80,90,100]"
                   :page-size="searchForm.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="clueDetailList.total">
    </el-pagination>
	</div>
</template>
<script>
import {getLocalStorage,parseToTimestamp,beforeToday,beforeAweek} from '@/utils/index'
export default {
	data(){
		return {
			choseTime:[],//搜索时间选择
			searchForm:{
        starttime:"",
        endtime:"",
				pageNum:"1",
				pageSize:"10"
			},
			clueDetailList:{}
		}
	},
	watch:{//监听搜索条件变化，请求数据
    searchForm:{
      handler:function(val,oldval){//监听回调
        this.fetchcluesList()
      },
      deep: true //开启深度监听
    }
  },
	created(){		
		this.fetchcluesList()
	},
	methods:{
		fetchcluesList(){
       this.$store
      .dispatch("cluedetails/clueslist",this.searchForm)
			.then(res => {
        this.clueDetailList = res.obj.list
        this.clueDetailList.total = res.obj.total
			})
    },
    noLimit(){
      this.searchForm.starttime=this.searchForm.endtime=""
      this.fetchcluesList()
    },
    pickerDate(val){//时间处理-转时间戳并截取前十位
      // console.log(val)
      if(val==null){
        this.searchForm.starttime=this.searchForm.endtime=""
      }
			this.searchForm.starttime = parseToTimestamp(val[0],10)
    	this.searchForm.endtime = parseToTimestamp(val[1],10)
    	this.fetchcluesList()
		},
		pickerToday(){
			this.searchForm.starttime = parseToTimestamp(beforeToday()[0],10)
      this.searchForm.endtime = parseToTimestamp(beforeToday()[1],10)
      this.fetchcluesList()
		},
		pickerThisWeek(){
			this.searchForm.starttime = parseToTimestamp(beforeAweek()[0],10)
    	this.searchForm.endtime = parseToTimestamp(beforeAweek()[1],10)
    	this.fetchcluesList()
		},
    handleSizeChange(pageSize){
      this.searchForm.pageSize = pageSize.toString()
    },
    handleCurrentChange(pageNum){
      this.searchForm.pageNum = pageNum.toString()
    }
	}
}
</script>

<style lang="scss" scoped>
.el-date-editor{
  margin-left:10px;
}
.companyHandle{
  justify-content: flex-start
}
</style>