<template>
	<div class="list-wrap">
		
		<div class="list-search">
      <el-input type="text" name="" placeholder="请输入查询内容"></el-input>
      <input class="btn-8032-general" type="button" name="" value="查询">
    </div>
    <div class="list-card">
    	<ul>
    		<li class="first-card" @click="addCard">
          <i class="el-icon-plus"></i>
          <p>点击新建名单</p>
          <el-dialog title="新建名单" :visible.sync="addCardVisible" width="25%">
			      <el-form ref="addCardForm" :ruels="addCardRules" :model="addCardForm">
			        <el-form-item label="名单名称：" :label-width="addCardLableWidth" prop="listName">
			          <el-input v-model="addCardForm.listName" autocomplete="off" placeholder="请输入名单名称"></el-input>
			        </el-form-item>
			        <el-form-item label="分配给：" :label-width="addCardLableWidth">
			          <el-select v-model="addCardForm.userId" placeholder="请选择子帐户" prop="userId">
			            <el-option v-for="item in subAccount" :label="item.realName" :key="item.id" :value="item.id"></el-option>
			          </el-select>
			        </el-form-item>	
			      </el-form>
			      <div slot="footer" class="dialog-footer">
			        <el-button @click="resetForm('addCardForm')">取 消</el-button>
			        <el-button type="primary" @click="addCardSubmit">确 定</el-button>
			      </div>
			    </el-dialog>
        </li>
        <li class="card-item" v-for="(item,index) in userCardList" :key="index">
          <el-switch
            v-model="item.updateTime"
            inactive-text="按年付费">
          </el-switch>
          <h2 @click="goToCardDetail(index)">{{item.listName}}</h2>
          <p>{{item.storageTime}}</p>
          <div class="to-subaccount">
	          <template>
	            <el-select v-model="value" placeholder="请添加子帐户">
	              <el-option
	                v-for="item in options"
	                :key="item.value"
	                :label="item.label"
	                :value="item.value">
	              </el-option>
	            </el-select>
	          </template>
          </div>
          <dl>
            <dt><span>新增</span>/现存：<span>122</span>/1000</dt>
            <dd>
              <span class="svg-container">
                <svg-icon icon-class="more" />
              </span>
            </dd>
          </dl>
        </li>
    	</ul>
    </div>    
	</div>
</template>
<script>
	import {getSubAccounts,addCardPost,requestCardList} from '@/api/cardmanage'
	import {getLocalStorage} from '@/utils/index'
	export default{
		name:'CardList',
		props:{
			goToCardDetail:{
				type: Function,
      	default: null
			}
		},
		data(){
			return {
				addCardForm:{
					listName:''
				},
				userId: getLocalStorage('userId'),
				addCardVisible: false,
				addCardLableWidth:'100px',
				subAccount:[],
				addCardRules:{
					listName:[{
						required:true,
						message:'请输入名单名称',
						trigger:'blur'
					}],
					userId:[{
						required:true,
						message:'请选择子帐户',
						trigger:'blur'
					}]
				},
				userCardList:{},
			}
		},
		created(){
			this.getCardList()
		},
		methods:{
			addCard(){
				this.addCardVisible = true
				getSubAccounts({parentId:this.userId}).then(response=>{
					try{
						this.subAccount = response.data.obj
					}catch(e){}
				})
			},
			addCardSubmit(){
				this.$refs['addCardForm'].validate((valid)=>{
					if(valid){
						console.log(valid)
						console.log(this.addCardForm)
						addCardPost(this.addCardForm).then(response=>{
							if(response.status==200){
								this.resetForm('addCardForm');
								this.addCardVisible=false;
								this.getCardList();
								this.$message.success('添加名单成功')
							}
						})
					}
				})
			},
			submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	console.log(valid)
          	console.log(this.addCardForm)
            // addCard({this.addCardForm}).then(response=>{
            // 	console.log(response)
            // })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
			resetForm(formName) {
				this.$nextTick(()=>{
	        this.$refs[formName].resetFields();
	      })
      },
      getCardList(){
      	requestCardList().then(response=>{
      		this.userCardList = response.data.obj
      	})
      },
      goToCardDetail(index){
      	console.log(index)
      }
		}
	}
</script>
<style lang="scss" scoped="">
	.list-search{
    display: flex;
    align-items: center;
    .el-input{
      width:200px;
      margin-right: 20px;
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
      		margin-top: 90px;
      	}
      }
    }
  }
</style>