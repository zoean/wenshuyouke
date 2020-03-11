<template>
  <div class="newcom-wrap">
    <!-- <div class="change-type">
    	<input type="button" class="btn-8032-general" value="企业">
    	<input type="button" class="btn-8032-grey" value="个体">
    </div> -->
    <div class="newcom-main">
    	<div class="search-result">
    		<span>文投优客今天为您推荐了<b>{{newComList.total}}</b>家符合条件的企业</span>
    		<div class="get-data">
	    		<template>
					  <el-select v-model="getNewComForm.listId" placeholder="请选择名单">
					    <el-option
					      v-for="(item,index) in cardList"
					      :key="index.id"
					      :label="item.listName"
					      :value="item.id">
					    </el-option>
					  </el-select>
					</template>			
	    		<input class="btn-8032-general" type="button" value="领取" @click="getNewComHandle">
	    	</div>	    	
    	</div>
    	<div class="data-list">
    		<template>
				  <el-table
				    ref="multipleTable"
				    :data="newComList.list"
				    tooltip-effect="dark"
				    style="width: 100%"
				    @selection-change="handleSelectionChange" empty-text="数据正在加载……">
				    <el-table-column
				      type="selection"
				      width="55">
				    </el-table-column>
				    <el-table-column
				      label="状态">
				      <template slot-scope="scope">{{ scope.row.entStatus }}</template>
				    </el-table-column>
				    <el-table-column
				      prop="name"
				      label="企业名称" ref="multipleTable">				      
				      <template slot-scope="scope">{{ scope.row.entName }}</template>
				    </el-table-column>
				    <!-- <el-table-column
				      prop="address"
				      label="所在地区"
				      show-overflow-tooltip>
				      <template slot-scope="scope">{{ scope.row.address }}</template>
				    </el-table-column> -->
				    <el-table-column
				      prop="address"
				      label="所属行业"
				      show-overflow-tooltip>
				      <template slot-scope="scope">{{ scope.row.industryName }}</template>
				    </el-table-column>
				    <el-table-column
				      prop="address"
				      label="法人"
				      show-overflow-tooltip>
				      <template slot-scope="scope">{{ scope.row.legalName }}</template>
				    </el-table-column>
				    <el-table-column
				      prop="address"
				      label="注册资本"
				      show-overflow-tooltip>
				      <template slot-scope="scope">{{ scope.row.regCapital }}{{ scope.row.regCurrency }}</template>
				    </el-table-column>
				    <el-table-column
				      prop="address"
				      label="企业类型"
				      show-overflow-tooltip>
				      <template slot-scope="scope">{{ scope.row.entType }}</template>
				    </el-table-column>
				    <el-table-column
				      prop="address"
				      label="注册日期"
				      show-overflow-tooltip>
				      <template slot-scope="scope">{{ scope.row.verifiedTime }}</template>
				    </el-table-column>
				    <el-table-column
				      prop="address"
				      label="地址"
				      show-overflow-tooltip>
				      <template slot-scope="scope">{{ scope.row.address }}</template>
				    </el-table-column>
				  </el-table>
				</template>
    	</div>
    	<el-pagination
			  background
			  layout="prev, pager, next"
			  :total="this.newComList.pages"
			  @current-change="reloadNewComList">
			</el-pagination>
    </div>
  </div>
</template>
<script>
/*
*@api requestNewComList 获取新企列表 post
*@api getCurUserCard 获取当前用户名单列表 get
*/
import {requestNewComList,getCurUserCard,getNewComToCard} from '@/api/foundclues'
import {getLocalStorage} from '@/utils/index'
export default {
  data() {
    return {
    	searchForm:{
    		pageNum:1,
    		pageSize:10
    	},
    	getNewComForm:{//领取新企推荐数据
    		dataSource:0,
    		listId:'',//选中要分配的名单
    		entId:[]//要领取到名单的企业id
    	},
    	newComList:{},//新企列表
    	cardList:{},
    	multipleSelection:[],//选中要领取到名单的新企
    }
  },
  created(){
  	this.getNewComList() //初始化获取第一页新企列表
  	this.getCurUserCardHandle() //获取当前用户名单列表用于领取新企数据到名单
  },
  methods: {
  	getNewComList(){//新企列表
  		requestNewComList(this.searchForm).then(response=>{
  			try{
  				if(response.status==200){
  					this.newComList = response.data.obj
  				}
  			}catch(e){
  				console.log(e)
  			}
  		})
  	},
  	reloadNewComList(curPage){
  		this.searchForm.pageNum = curPage
  		this.getNewComList()
  	},
  	getCurUserCardHandle(){//获取当前用户的名单列表
			getCurUserCard({entUserId:getLocalStorage('userId')}).then(response=>{					
  			this.cardList = response.data.obj
			})
  	},
  	getNewComHandle(){//领取企业到名单
  		if(!this.getNewComForm.listId){
				this.$message.error('请选择领取目标名单')
			}else if(!this.getNewComForm.entId){
  			this.$message.error('请在列表前选取要领取的企业')
			}else{
				getNewComToCard(this.getNewComForm).then(response=>{
	  			try{
	  				if(response.status==200){
	  					this.reloadNewComList()
	  					this.$message.success(`您已成功领取${this.getNewComForm.entId.length}条数据至名单`)
	  					// 领取成功清空领取Form
	  					this.getNewComForm.entId = []
	  					this.getNewComForm.listId = ''
	  				}
	  			}catch(e){}
	  		})
  		}  		
  	},
    handleSelectionChange(val) {//监听selection选择事件
    	this.getNewComForm.entId = []
    	for(let i in val){
    		this.getNewComForm.entId.push(val[i].id)    		
    	}
    }
  }
 }
</script>
<style lang="scss">
	.newcom-wrap{
		width: 100%;
		color:#666;
		display: flex;
		flex-direction:column;
		.change-type{
			input{
				margin-right:14px;
			}
		}
		.newcom-main{
			background:rgba(255,255,255,1);
			box-shadow:0px 2px 7px 1px rgba(211,229,255,1);
			border-radius:12px;
			margin-top:16px;
			padding: 22px 32px;
			.open-search{
				background:rgba(244,244,244,1);
				border:1px solid rgba(230,230,230,1);
				border-radius:12px;
				text-align:center;
				color:#4083FF;
				text-decoration: underline;
				line-height: 64px;
				font-size: 14px;
			}
			.search-area{
				.if-all-cond{

				}
			}
			.search-result{
				display:flex;
				justify-content: space-between;
				margin:25px auto;
				span{
					b{
						color:#FF4040;
						font-weight: 100;
						padding: 0 5px;
					}
				}
				div{
					.el-select{
						margin-right: 10px;
					}
				}
			}
			.el-pagination{
				margin-top: 20px;
			}
		}
	}
</style>