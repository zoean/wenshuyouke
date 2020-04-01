<template>
	<div class="list-wrap">		
		<div class="list-search">
      <el-input type="text" name="" v-model="searchCardForm.listName" placeholder="请输入查询内容"></el-input>
      <input class="btn-8032-general" type="button" name="" value="查询" @click="getCardList">
    </div>
    <div class="list-card">
    	<ul>
    		<li class="first-card" @click="addCard">
          <i class="el-icon-plus"></i>
          <p>点击新建名单</p>
        </li>
        <li class="card-item" v-for="(item,index) in userCardList" :key="index">
          <!-- <el-switch
            v-model="item.updateTime"
            inactive-text="按年付费">
          </el-switch> -->
          <h2 @click="goToCardDetail(item.id)">{{item.listName}}</h2>
          <p>{{item.storageTime | parseDateTime}}</p>
          <div class="to-subaccount">
          	<h3 :class="item.userName ? 'highblue': ''" style="font-weight:100">{{item.userName || '未指派'}}</h3>
	          <!--  -->
          </div>
          <dl>
            <dt><span>新增</span>/现存：<span>{{item.receiveToday||0}}</span>/{{item.receiveCount || 0}}</dt>
            <dd>
            	<span class="svg-container" slot="reference">
            		<i title="编辑" class="el-icon-edit" @click="renameCard(item.id, item.listName)"></i>
            		<i title="指派" class="el-icon-thumb" @click="distributionList(item.id, item.userId, item.userName)"></i>
            		<i title="删除" class="el-icon-delete" @click="delList(item.id)"></i>
              </span>
            </dd>
          </dl>
        </li>
    	</ul>
    </div> 

    <el-dialog title="新建名单" :visible.sync="addCardVisible" width="25%">
      <el-form ref="addCardForm" :model="addCardForm">
        <el-form-item label="名单名称：" :label-width="addCardLableWidth">
          <el-input v-model="addCardForm.listName" autocomplete="off" placeholder="请输入名单名称"></el-input>
        </el-form-item>			        	
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleAddCardSubmit">取 消</el-button>
        <el-button type="primary" @click="addCardSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配/指派子帐户 -->
    <el-dialog :visible.sync="distributionVisible" width="30%">
    	<el-form>
    		<el-form-item label="分配给：" :label-width="addCardLableWidth">
          <el-select v-model="distributionForm.userId" placeholder="请选择子帐户">
            <el-option v-for="item in subAccount" :label="item.realName" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
    	</el-form>
    	<el-row type="flex" justify="end" :gutter="5">
      	<el-col :span="5"><el-button @click="cancleDistribution">取消</el-button></el-col>
      	<el-col :span="5"><el-button @click="distrubutionSubmit()" type="primary">确定</el-button></el-col>
      </el-row>
    </el-dialog>   
		<el-dialog
		  title="删除名单"
		  :visible.sync="delVerifyVisible"
		  width="30%">
		  <span>是否确认删除该名单？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="delVerifyVisible = false">取 消</el-button>
		    <el-button type="primary" @click="delListVerify">确 定</el-button>
		  </span>
		</el-dialog>
    	<!-- 修改名单名称 -->
		<el-dialog title="修改名称" :visible.sync="renameVisible" width="25%">
      <el-form ref="renameForm" :model="renameForm">
        <el-form-item label="名单名称：" :label-width="addCardLableWidth">
          <el-input autocomplete="off" placeholder="请输入名单名称" v-model="renameForm.listName"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="end" :gutter="5">
      	<el-col :span="5"><el-button @click="cancleRename">取消</el-button></el-col>
      	<el-col :span="5"><el-button @click="renameSubmit" type="primary">确定</el-button></el-col>
      </el-row>
    </el-dialog>
	</div>
</template>
<script>
	import {getSubAccounts,addCardPost,requestCardList,distributionPost,renameCardPost,delCardPost} from '@/api/cardmanage'
	import {getLocalStorage,parseTime, parseDateTime} from '@/utils/index'
	export default{
		name:'CardList',
		filters: {
	    parseDateTime(val){
	      if(val){
	        return parseDateTime(val)
	      }else{
	        return '--'
	      }      
	    }
	  },
		props:{
			changeCom:{
				type:Function,
				default:null
			},
			setCurListId:{
				type:Function,
				default:null
			}
		},
		data(){
			return {
				distributionVisible:false,//名单指派
				delVerifyVisible:false,//删除名单确认
				searchCardForm:{//搜索名单列表
					listName:'',
					entUserId: getLocalStorage('userId')
				},
				addCardForm:{//添加名单
					listName:'',					
					entUserId: getLocalStorage('userId')
				},
				renameForm:{//名单重命名
					listName:'',
					entUserId: getLocalStorage('userId')
				},
				distributionForm:{
					id:'',
					userId:'',//要指派的子帐户
					entUserId: getLocalStorage('userId')
				},
				delListForm:{
					entUserId:getLocalStorage('userId')
				},
				originCardName:'',
				realName:'',
				addCardVisible: false,
				renameVisible:false,
				addCardLableWidth:'100px',
				subAccount:[],
				userCardList:{},
			}
		},
		created(){
			this.getSubAccountsHandle();
			this.getCardList()
		},
		methods:{
			getSubAccountsHandle(){
				getSubAccounts({parentId:getLocalStorage('userId')}).then(response=>{//获取子帐户列表
					this.subAccount = response.data.obj   
				})
			},			
      getCardList(){
      	requestCardList(this.searchCardForm).then(response=>{
      		this.userCardList = response.data.obj
      	})
      },
			addCard(){
				this.addCardVisible = true
        this.addCardForm.listName = ''
			},
			distributionList(id, userId, userName){ //名单指派
				this.distributionVisible = true
				this.distributionForm.id = id
				this.distributionForm.userId = userId	
        for(let i in this.subAccount){
          if(this.subAccount[i].id == this.distributionForm.userId){
            this.distributionForm.userName = this.subAccount[i].userName
          }
        }			
			},
			distrubutionSubmit(){
				this.distributionVisible = false // 被指派人id
				let curUser = this.subAccount.find(item => {
					return item.id === this.distributionForm.userId
				})
				this.distributionForm.userName = curUser.realName
				distributionPost(this.distributionForm).then(response=>{
					try{
            if(response.data.status == 200){
              this.$message.success('名单分配成功')
              this.getCardList()
            }else{
              this.$message.error(response.data.message)
            }
						
					}catch(e){
					}
				})				
			},
			cancleDistribution(){
				this.distributionVisible = false
			},
			cancleAddCardSubmit(){
				this.resetForm('addCardForm')
				this.addCardVisible = false
			},
			cancleRename(){
				this.resetForm('renameForm');
				this.renameVisible = false;
			},
			delList(id){//删除名单
				this.delVerifyVisible = true	
				this.delListForm.id = id			
				console.log(this.delVerifyVisible)
			},
			delListVerify(){
				this.delVerifyVisible = false
				delCardPost(this.delListForm).then(response=>{
					if(response.data.status==200){
						this.getCardList()
						this.$message.success('删除成功')
					}else{
            this.$message.error(response.data.message)
          }
				})
			},
			renameSubmit(){
				if(!this.renameForm.listName){
					this.$message.error('请输入名单名称')
				}else{
					renameCardPost(this.renameForm).then(response=>{
						if(response.data.status==200){
							this.$message.success('修改成功')
							this.getCardList();
							this.renameVisible = false;
						}else{
              this.$message.error(response.data.message)
            }	
					})
				}
			},
			addCardSubmit(){//提交添加名单表单
				if(!this.addCardForm.listName){
					this.$message.error('请输入名单名称')
				}else{
					addCardPost(this.addCardForm).then(response=>{
						if(response.data.status==200){
							this.resetForm('addCardForm');
							this.addCardVisible = false;
							this.getCardList();
							this.$message.success('添加名单成功')
						}else{
              this.$message.error(response.data.message)
            }
					})
				}
			},
			resetForm(formName) {
				this.$nextTick(()=>{
	        this.$refs[formName].resetFields();
	      })
      },
      goToCardDetail(index){
      	this.changeCom()
      	this.$store.commit('cluesmanage/SET_CURCARDID', index)
      },
      renameCard(cardId,cardName){
      	this.renameForm.listName = cardName
      	this.renameForm.id = cardId
      	this.renameVisible = true
      }
		}
	}
</script>
<style lang="scss" scoped>
	.list-search{
    display: flex;
    align-items: center;
    margin-top:10px;
    .el-input{
      width:200px;
      margin-right: 20px;
    }
    input[type="button"]{
    	cursor: pointer;
    }
  }
  .list-card{
    ul{
      width: 100%;
      display: flex;
      align-content: flex-start;
      flex-wrap:wrap;
      flex-grow: 1;
      li{
        width:340px;
        height:440px;
        padding:16px;
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 6px 0px #d3e5ff;
        border-radius:12px;
        margin:13px 13px 13px 0;
        flex-direction: column;
        .el-switch{
          display: flex;
          justify-content: flex-end;
        }
        h2{
          color: #4386FE;
          font-size: 30px;
          text-align: center;
          margin-top: 62px;
          cursor: pointer;
        }
        .el-select{
          margin:0;
          width: 160px;
        }
        p{
          text-align: center;
        }
        dl{
          margin-top: 95px;
          display: flex;
          justify-content: space-between;
          flex-direction: row;
          dt{
            span{
              color: #CC0000
            }
          }
          dd{
          	.svg-container{
          		cursor: pointer;
          	}
          	p{
          		cursor: pointer;
          	}
          	p:hover{
          		background: #E1F5FF;
          	}
          }
        }
      }
      li.first-card{
      	display: flex;
      	justify-content: center;      	
        cursor: pointer;
        i.el-icon-plus{
          font-size: 40px;
          color: #ccc;
          margin: 160px 0 110px 0;
          text-align: center;
        }
        p{
          color: #4084FF;
          text-align: center;
          cursor: pointer;
        }
      }
      .card-item{
      	.to-subaccount{
      		display: flex;
      		justify-content: center;
      		margin-top: 60px;      		
      	}
      }
      dd{
  			span{
  				i{
  					font-weight: 600;
  					font-size: 20px;
  					margin-left: 10px;
  				}
  			}
  		}
    }
  }
</style>