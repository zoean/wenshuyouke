<template>
	<div class="main-box">
		<el-button class="add-entuser" type="primary" @click="addEntUserHandle">增加企业用户</el-button>
		<div class="search-area">      
      <dl>
        <dt>企业搜索：</dt>
        <dd>
          <el-input v-model="searchForm.entName"></el-input>
        </dd>
      </dl>
    </div>
    <div class="companyHandle">
    	当前有<b class="highred">{{entUserListObj.total}}</b>家企业入驻
    </div>
    <div class="data-content">
    	<el-table ref="entUserTable" :data="entUserListObj.list">
    		<el-table-column
		      type="index"
		      width="50">
		    </el-table-column>
	    	<el-table-column
			      label="企业名称">
		      <template slot-scope="scope">{{ scope.row.entName }}</template>
		    </el-table-column>   		
	    	<el-table-column
			      label="用户名">
		      <template slot-scope="scope">{{ scope.row.userName }}</template>
		    </el-table-column>   			
	    	<el-table-column
			      label="开户时间">
		      <template slot-scope="scope">{{ scope.row.storageTime | parseDateTime }}</template>
		    </el-table-column>  		
	    	<el-table-column
			      label="上次登录时间">
		      <template slot-scope="scope">{{ scope.row.lastLonginTime | parseDateTime }}</template>
		    </el-table-column>  	
		    <el-table-column
	      label="操作"
	      width="320">
	      <template slot-scope="scope">
	        <el-button type="primary" v-if="scope.row.userStatus == 0" size="mini" @click="changeUserStatus(scope.row.id, scope.row.userStatus)">开启</el-button>
	        <el-button type="info" v-else size="mini" @click="changeUserStatus(scope.row.id, scope.row.userStatus)">停用</el-button>	        
		    <el-button type="primary" size="mini" @click="editEntUserHandle(scope.row.id, scope.row.entName, scope.row.userName)">编辑</el-button>
		    <el-button type="primary" size="mini" @click="resetPasswordHandle(scope.row.id)">重置密码</el-button>
		    <el-button type="info" size="mini" @click="delEntUserHandle(scope.row.id)">删除</el-button>
	      </template>
	    </el-table-column>   		
	    </el-table>
    	<el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="searchForm.pageNum"
	      :page-sizes="[10,20,30,40,50,60,70,80,90,100, 200]"
	      :page-size="searchForm.pageSize"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="entUserListObj.total">
	    </el-pagination>
    </div>
    <!-- 增加企业用户 -->
    <el-dialog :visible.sync="addEditEntUserVisible" :title="addEditType" width="30%">
    	<el-form :model="addEditEntUserForm" ref="addEditEntUserForm" :rules="addEditEntUserRules">
    		<el-form-item label="企业名称" inline :label-width="formLabelWidth" prop="entName">
    			<el-input v-model="addEditEntUserForm.entName"></el-input>
    		</el-form-item>
    		<el-form-item label="用户名" inline :label-width="formLabelWidth" prop="userName">
    			<el-input v-model="addEditEntUserForm.userName"></el-input>
    		</el-form-item>
    		<el-form-item label="密码" inline :label-width="formLabelWidth" prop="passWord" v-show="addEditType != '编辑企业用户'">
    			<el-input v-model="addEditEntUserForm.passWord"></el-input>
    		</el-form-item>
    	</el-form>
    	<div slot="footer" class="dialog-footer">
		    <el-button @click="cancleHandle('addEditEntUserVisible','addEditEntUserForm')">取 消</el-button>
		    <el-button type="primary" @click="addEditEntUserSubmit">确 定</el-button>
		  </div>
    </el-dialog>
    <el-dialog :visible.sync="delEntUserVisible" title="删除企业用户" width="30%">
    	<p>您正在进行删除操作，删除之后该企业用户相关帐单、操作记录不可恢复</p>
    	<p>请谨慎操作，是否确认删除该企业？</p>
    	<div slot="footer" class="dialog-footer">
		    <el-button @click="cancleHandle('delEntUserVisible')">取 消</el-button>
		    <el-button type="primary" @click="delEntUserSubmit">确 定</el-button>
		  </div>
    </el-dialog>
    <el-dialog :visible.sync="resetPasswordTipVisible" width="30%">
    	<p>重置密码成功，重置后的密码为 <span class="highblue">123456</span></p>
    	<div slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="resetPasswordTipVisible = false">确 定</el-button>
    	</div>
    </el-dialog>
    	
    </el-dialog>
	</div>
</template>
<script>
import Vue from 'vue'
import {ellipsis,parseDateTime} from '@/utils/filter'
import {addEntUser,getEntUserList,updateEntUser,delEntUser,resetEntUserPassWord} from '@/api/ukadmin/user'
import {editWorker} from '@/api/department'
export default{
	data(){
		var validateentName = (rule, value, callback) => {
			if (value =='') {
				callback(new Error('请输入企业名称'));
			}else if(value.length>15||value.length<2){
				callback(new Error('企业名称在2~15字符之间'));
			}else {
				callback();
			}
		};
		var validateuserName = (rule, value, callback) => {
			if (value =='') {
				callback(new Error('请输入用户名'));
			}else {
				callback();
			}
		};
		// var passWord = (rule, value, callback) => {
		// 	if (value =='') {
		// 		callback(new Error('请输入密码'));
		// 	}else {
		// 		callback();
		// 	}
		// };
		return {
			searchForm: {
				entName: '',
				pageNum: 1,
				pageSize: 10,
				userStatus: null
			},
			addEditEntUserForm:{
				entName:'',
				userName: '',
				passWord: '',
				userType: 'admin'
			},
			addEditEntUserVisible: false,
			// addEditEntUserRules:{
			// 	entName: [{
			// 		required:true,message:'请输入企业名称',trigger:'blur'
			// 	}],
			// 	userName:[{
			// 		required:true, message: '请输入用户名', trigger: 'blur'
			// 	}],
			// 	passWord:[{
			// 		required: true, message:'请输入密码',trigger: 'blur'
			// 	}]
			// },
			addEditEntUserRules: {
				entName: [
					{ validator: validateentName, trigger: 'blur' }
				],
				userName: [
					{ validator: validateuserName, trigger: 'blur' }
				]
			},
			delEntUserVisible: false,
			resetPasswordTipVisible: false,
			entUserListObj:{},
			editUserStatusForm:{},
			formLabelWidth: "100px",
			addEditType: '编辑企业用户',
			curId: []
		}
	},
	watch:{
		searchForm:{
			handler: function (val,oldval){
				this.fetchEntUserList()
			},
			deep: true
		}
	},
	created(){
		this.fetchEntUserList()
	},
	methods: {
		fetchEntUserList(){
			getEntUserList(this.searchForm).then(response => {
				this.entUserListObj = response.data.obj
			})
		},
		addEntUserHandle(){
			this.addEditEntUserVisible = true
			this.addEditType = "添加企业用户"
			this.addEditEntUserForm.entName = ''
			this.addEditEntUserForm.userName = ''
			this.addEditEntUserForm.id = ''
		},
		editEntUserHandle(id, entName, userName){
			this.addEditEntUserVisible = true
			this.addEditType = "编辑企业用户"
			this.addEditEntUserForm.entName = entName
			this.addEditEntUserForm.userName = userName
			this.addEditEntUserForm.id = id
		},
		delEntUserHandle(id){ //删除企业用户
			this.curId = []//删除前先清空Array
			this.curId.push(id)
			this.delEntUserVisible = true
		},
		addEditEntUserSubmit(formName){
			this.$refs.addEditEntUserForm.validate((valid) => {
				if (valid) {
					if(this.addEditType == '编辑企业用户'){
						updateEntUser(this.addEditEntUserForm).then(response => {
							if(response.status == 200){
								this.$message.success('企业用户已修改')						
								this.cancleHandle('addEditEntUserVisible','addEditEntUserForm')
								this.fetchEntUserList()
							}else{
								this.$message.error('编辑企业用户失败，请重试')
							}
						})
					}else{
						addEntUser(this.addEditEntUserForm).then(response => {
							if(response.status == 200){
								this.$message.success('成功添加企业用户')		
								this.fetchEntUserList()				
								this.cancleHandle('addEditEntUserVisible','addEditEntUserForm')
							}else{
								this.$message.error('添加企业用户失败，请重试')
							}
						})
					}	
				} else {
					return false;
				}
			});
		},
		changeUserStatus(id,status){
			let wantStatus = status
			if(status == 1){
				wantStatus = 0
			}else{
				wantStatus = 1
			}
			editWorker({id:id, userStatus:wantStatus}).then(response => {
				if(response.status == 200){
					this.$message.success('用户状态改变成功')
					this.fetchEntUserList()
				}else{
					this.$message.success('用户状态改变失败，请重试')
				}
			})
		},
		delEntUserSubmit(){
			delEntUser({ids: this.curId}).then(response => {
				if(response.status == 200){
					this.$message.success('企业用户删除成功')
					this.delEntUserVisible = false
					this.fetchEntUserList()
				}else{
					this.$message.error('删除操作失败，请重试')
				}
			})
		},
		resetPasswordHandle(id){
			resetEntUserPassWord({id}).then(response => {
				if(response.status == 200){
					this.resetPasswordTipVisible = true
				}else{
					this.$message.error('重置密码失败，请重试')
				}
				
			})
		},
		// 取消操作 1、隐藏dialog 2、重置表单
		cancleHandle(visiblePro, formObj){//
			this[visiblePro] = false
			if(formObj){
				this.$refs[formObj].resetFields()
			}			
		},
    handleSizeChange(val){
    	this.searchForm.pageSize = val
    	this.fetchEntUserList()
    },
		handleCurrentChange(val){
			this.searchForm.pageNum = val
			this.fetchEntUserList()
		}
	}
}
</script>
<style lang="scss" scoped>
.add-entuser{
	position: absolute;
	right:40px;
	top:54px;
}
.companyHandle{
	display: flex;
	justify-content: flex-start;
	height: 40px;
	margin:20px 0 10px;
	b{
		padding: 0 5px;
	}
}
</style>