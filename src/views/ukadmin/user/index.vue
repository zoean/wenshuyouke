<template>
	<div class="main-box">
		<el-button class="add-entuser" type="primary" @click="addEntUserVisibel = true">增加企业用户</el-button>
		<div class="search-area">      
      <dl>
        <dt>企业搜索：</dt>
        <dd>
          <el-input v-model="searchForm.entName"></el-input>
        </dd>
      </dl>
    </div>
    <div class="commonHandle">
    	
    </div>
    <div class="data-content">
    	<el-table ref="entUserTable" :data="entUserListObj.list">
    		<el-table-column
		      type="index"
		      width="50">
		    </el-table-column>
	    	<el-table-column
			      label="企业名称">
		      <template slot-scope="scope">{{ scope.row.realName }}</template>
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
	      width="100">
	      <template slot-scope="scope">
	        <el-button type="primary" v-if="scope.row.userStatus == 0" size="small" @click="changeUserStatus(scope.row.id, scope.row.userStatus)">开启</el-button>
	        <el-button type="info" v-else size="small" @click="changeUserStatus(scope.row.id, scope.row.userStatus)">停用</el-button>
	      </template>
	    </el-table-column>   		
	    </el-table>
    	<el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="addEntUserForm.pageNum"
	      :page-sizes="[10,20,30,40,50,60,70,80,90,100, 200]"
	      :page-size="addEntUserForm.pageSize"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="addEntUserForm.total">
	    </el-pagination>
    </div>
    <!-- 增加企业用户 -->
    <el-dialog :visible.sync="addEntUserVisibel" :title="addEditType" width="30%">
    	<el-form :model="addEntUserForm" ref="addEntUserForm" :rule="addEntUserRules">
    		<el-form-item label="企业名称" inline :label-width="formLabelWidth" prop="entName">
    			<el-input v-model="addEntUserForm.entName"></el-input>
    		</el-form-item>
    		<el-form-item label="用户名" inline :label-width="formLabelWidth" prop="userName">
    			<el-input v-model="addEntUserForm.userName"></el-input>
    		</el-form-item>
    		<el-form-item label="密码" inline :label-width="formLabelWidth" prop="passWord">
    			<el-input v-model="addEntUserForm.passWord"></el-input>
    		</el-form-item>
    	</el-form>
    	<div slot="footer" class="dialog-footer">
		    <el-button @click="cancleHandle('addEntUserVisibel','addEntUserForm')">取 消</el-button>
		    <el-button type="primary" @click="addEntUserSubmit">确 定</el-button>
		    <el-button type="primary" @click="editEntUser">编辑</el-button>
		  </div>
    </el-dialog>	
	</div>
</template>
<script>
import Vue from 'vue'
import {ellipsis,parseDateTime} from '@/utils/filter'
import {addEntUser,getEntUserList} from '@/api/ukadmin/user'
import {editWorker} from '@/api/department'
export default{
	data(){
		return {
			searchForm: {
				entName: '',
				pageNum: 1,
				pageSize: 10,
				userStatus: null
			},
			addEntUserForm:{
				entName:'',
				userName: '',
				passWord: '',
				userType: 'admin'
			},
			addEntUserVisibel: false,
			addEntUserRules:{
				entName: [{
					required:true,message:'请输入企业名称',trigger:'blur'
				}]
			},
			entUserListObj:{},
			editUserStatusForm:{},
			formLabelWidth: "100px",
			addEditType: ''
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
		addEntUserSubmit(){
			addEntUser(this.addEntUserForm).then(response => {
				try{
					if(response.status == 200){
						this.$message.success('成功添加企业用户')						
						this.cancleHandle('addEntUserVisibel','addEntUserForm')
					}else{
						this.$message.error('添加企业用户失败，请重试')
					}
				}catch(e){}
			})
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

		// 取消操作 1、隐藏dialog 2、重置表单
		cancleHandle(visiblePro, formObj){//
			this[visiblePro] = false
			if(formObj){
				this.$refs[formObj].resetFields()
			}			
		},
    handleSizeChange(val){
    	this.addEntUserForm.pageSize = val
    	this.fetchEntUserList()
    },
		handleCurrentChange(val){
			this.addEntUserForm.pageNum = val
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
.commonHandle{
	display: flex;
	justify-content: flex-end;
	height: 40px;
	.el-button{
		margin-left: 20px;
	}
}
</style>