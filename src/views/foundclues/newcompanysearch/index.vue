<template>
  <div class="newcom-wrap">
    <div class="newcom-main">
    	<div class="search-area">
    		<dl>
    			<dt>所在地区：</dt>
    			<dd>
    				<el-button class="btn-blue-default" type="primary" @click="resetSearchOption(1)">不限</el-button>
    				<el-select v-model="provinceName" placeholder="省级地区">
    					<el-option v-for="(item,index) in provinceList" :value="item.id" :label="item.name"></el-option>
    				</el-select>
    				<el-select v-model="cityName" placeholder="市级地区">
    					<el-option v-for="(item,index) in cityList" :value="item.id" :label="item.name"></el-option>
    				</el-select>
    				<el-select v-model="districtName" placeholder="区级地区">
    					<el-option v-for="(item,index) in districtList" :value="item.id" :label="item.name"></el-option>
    				</el-select>
    			</dd>
    		</dl>
    		<dl>
    			<dt>所属行业：</dt>
    			<dd>
    				<el-button class="btn-blue-default" type="primary" @click="resetSearchOption(2)">不限</el-button>
    				<el-select v-model="industryName" placeholder="一级">
    					<el-option v-for="item in industryList" :value="item.industryCode" :label="item.industryName"></el-option>
    				</el-select>
    				<el-select v-model="subIndustryName" placeholder="二级">
    					<el-option v-for="item in subIndustryList" :value="item.id" :label="item.industryName"></el-option>
    				</el-select>
    			</dd>
    		</dl>
    		<dl>
    			<dt>企业类型：</dt>
    			<dd>
    				<el-button class="btn-blue-default" type="primary" @click="resetSearchOption(3)">不限</el-button>
    				<el-radio-group v-model="searchForm.entType" @change="changeEntType">
				      <el-radio-button value="个人独资企业" label="个人独资企业">个人独资企业</el-radio-button>
				      <el-radio-button value="有限责任公司" label="有限责任公司">有限责任公司</el-radio-button>
				      <el-radio-button value="股份有限公司" label="股份有限公司">股份有限公司</el-radio-button>
				      <el-radio-button value="外商投资企业" label="外商投资企业">外商投资企业</el-radio-button>
				      <el-radio-button value="1" label="1">其他</el-radio-button>
				    </el-radio-group>
    			</dd>
    		</dl>
    	</div>
    	<div class="search-result">
    		<span>文投优客今天为您推荐了<b class="highred">{{newComList.total}}</b>家符合条件的企业</span>
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
				    @selection-change="handleSelectionChange" :row-key="getRowKey">
				    <el-table-column
				      type="selection"
				      width="55" :reserve-selection="true">
				    </el-table-column>
				    <el-table-column
				      prop="name"
				      label="企业名称" ref="multipleTable" width="320px" show-overflow-tooltip>				      
				      <template slot-scope="scope">{{ scope.row.entName }}</template>
				    </el-table-column>
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
				      label="注册资本(万元)"
				      show-overflow-tooltip>
				      <template slot-scope="scope">{{ Math.floor(scope.row.regCapital) }}</template>
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
			  @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="searchForm.pageNum"
	      :page-sizes="[20, 50, 100, 200, 500, 1000, 2000]"
	      :page-size="searchForm.pageSize"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="newComList.total">
			</el-pagination>
    </div>
  </div>
</template>
<script>
/*
*@api requestNewComList 获取新企列表 post
*@api getCurUserCard 获取当前用户名单列表 get
*@api area 省 市 区
industry 市
*/
import {requestNewComList,getCurUserCard,getNewComToCard,getSearchOption} from '@/api/foundclues'
import {area, category, industry} from '@/api/companysearch'
import {getLocalStorage} from '@/utils/index'
export default {
  data() {
    return {
    	searchForm:{
    		pageNum:1,
    		pageSize:20,
    		raCode: '', //省市区
    		industryCode:'', //行业
    		entType: '' //企业类型
    	},
    	getNewComForm:{//领取新企推荐数据
    		dataSource:0,
    		listId:'',//选中要分配的名单
    		entId:[]//要领取到名单的企业id
    	},
    	provinceName:'',
    	provinceList:[],
    	cityName: '',
    	cityList: [],
    	districtName: '',
    	districtList: [],
    	industryName: '',
    	industryList: [],
    	subIndustryName: '',
    	subIndustryList: [],
    	newComList:{},//新企列表
    	cardList:{},
    	pid: 100000,
    	multipleSelection:[]//选中要领取到名单的新企
    }
  },
  created(){
  	this.getAreaObj('province') //获取省市区搜索条件
  	this.getNewComList() //初始化获取第一页新企列表
  	this.getCurUserCardHandle() //获取当前用户名单列表用于领取新企数据到名单
  	this.getIndustryObj()
  },
  watch:{//监听搜索条件变化，请求数据
    searchForm:{
      handler:function(val,oldval){//监听回调
        console.log(val)
        this.getNewComList()
      },
      deep: true //开启深度监听
    },
    provinceName: function(val, oldval){//省
    	this.pid = val
    	this.searchForm.raCode = val
      this.cityList = [] //监听当省发生变化时，清空上一次市和区的选中状态和数据
      this.districtList = []
      this.cityName = ''
      this.districtName = ''
    	this.getAreaObj('city')
    },
    cityName: function (val, oldval){//市
    	this.pid = val
    	this.searchForm.raCode = val
    	this.getAreaObj()
    },
    districtName: function (val,oldval){//区
    	this.searchForm.raCode = val
    },
    industryName: function (val,oldval){ //行业
      this.subIndustryList = [] // 监听当行业一级发生变化，清空上一次二级行业的选中状态和数据
      this.subIndustryName = '' 
    	this.getSubIndustryObj(val)
    	this.searchForm.industryCode = val
    },
    subIndustryName: function (val, oldval){
    	this.searchForm.industryCode = val
    }
  },
  methods: {
  	changeEntType(val){
  		console.log(val)
  	},
  	getRowKey(row){
  		return row.id
  	},
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
  	getAreaObj(obj){
			area({pid: this.pid}).then(response => {
				try{
					if(response.status == 200){
						if(obj == 'province'){
							this.provinceList = response.data.obj
						}else if(obj == 'city'){
							this.cityList = response.data.obj
						}else{
							this.districtList = response.data.obj
						}
					}
				}catch(e){}
			})
  	},
  	getIndustryObj(){//获取行业
			category().then(response => {
				if(response.status == 200){
					this.industryList = response.data.obj
				}
			})
  	},
  	getSubIndustryObj(code){
  		industry({ industryCode: code}).then(response => {
  			if(response.status == 200){
  				console.log(response)
  				this.subIndustryList = response.data.obj
  			}  			
  		})
  	},
  	resetSearchOption(tag){ //不限
  		switch (tag) {
  			case 1:
  				this.searchForm.raCode = ''
  				this.provinceName = ''
  				this.cityList = []
					this.districtList = []
					this.pid = 100000
  				break
  			case 2:
  				this.searchForm.industryCode = ''
          this.industryName = ''
          this.industryList = ''
          this.subIndustryName = ''
          this.subIndustryList = []
  				break
  			default:
  				this.searchForm.entType = ''
  				break;
  		}
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
    		if(!this.getNewComForm.entId.includes(val[i].id)){
    			this.getNewComForm.entId.push(val[i].id)
    		}  		
    	}
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
        align-items: center;
				margin:25px auto;
				span{
					b{
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
<style lang="scss" scoped>
.companyHandle {
  display: flex;
  justify-content: space-between;
}
</style>