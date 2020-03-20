<template>
	<div class="main-box">
		<div class="department-wrap">
			<div class="department-tree">
				<div class="department-handle">
					<h3>{{enterpriseName}}</h3>
				</div>
				<el-tree :check-on-click-node=false :accordion=false ref="departmentTree" highlight-current :expand-on-click-node="false" default-expand-all show-checkbox :data="departmentTree" :props="defaultProps" show-checkbox :default-expand-all="true" node-key="id" @node-click="nodeClick">
					<span class="custom-tree-node" slot-scope="{ node, data }">
		        <span>{{ node.label }}</span>
		        <span class="tree-handle">
		        	<i class="el-icon-plus" title="添加同级部门" @click="addDepartmentHandle(data)"></i>
		        	<i class="el-icon-edit" title="编辑部门名称" @click="editDepartmentHandle(data)"></i>
		        	<i class="el-icon-delete" title="删除该部门" @click="delDepartmentVerifyHandle(data)"></i>
		          <!-- <el-button
		            type="text"
		            size="mini"
		            @click="() => append(data)">
		            Append
		          </el-button>
		          <el-button
		            type="text"
		            size="mini"
		            @click="() => remove(node, data)">
		            Delete
		          </el-button> -->
		        </span>
		      </span>
				</el-tree>
			</div>
			<div class="gutter-line"></div>
			<div class="department-data">
				<h2 class="highblue">用户列表</h2>
				<div class="result-handle">
					<p>该主管名下有<span class="highblue">{{workerList.total}}</span>名成员</p>
					<p>
						<el-button type="primary" icon="el-icon-plus" @click="addWorkerHandle">新增用户</el-button>
						<el-button type="info" icon="el-icon-delete" @click="delWorkerHandle">删除用户</el-button>
					</p>
				</div>
				<el-table
			    ref="multipleTable"
			    :data="workerList.list"
			    tooltip-effect="dark"
			    style="width: 100%"
			    @selection-change="handleSelectionChange">
			    <el-table-column
			      type="selection"
			      width="55">
			    </el-table-column>
			    <el-table-column
			      label="员工编号">
			      <template slot-scope="scope">{{ scope.row.workNo }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="address"
			      label="分配帐号"
			      show-overflow-tooltip>
			      <template slot-scope="scope">{{ scope.row.userName }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="name"
			      label="姓名">
			      <template slot-scope="scope">{{ scope.row.realName }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="address"
			      label="权限"
			      show-overflow-tooltip>
			      <template slot-scope="scope">{{ scope.row.userType == 'seat' ? '坐席' : '坐席组长' }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="userRole"
			      label="角色"
			      show-overflow-tooltip>
			      <template slot-scope="scope">{{ scope.row.userRole }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="address"
			      label="性别"
			      show-overflow-tooltip>
			      <template slot-scope="scope">{{ scope.row.sex }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="address"
			      label="部门"
			      show-overflow-tooltip>
			      <template slot-scope="scope">{{ scope.row.department }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="address"
			      label="职位"
			      show-overflow-tooltip>
			      <template slot-scope="scope">{{ scope.row.position }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="address"
			      label="手机号"
			      show-overflow-tooltip>
			      <template slot-scope="scope">{{ scope.row.phone }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="address"
			      label="邮箱"
			      show-overflow-tooltip>
			      <template slot-scope="scope">{{ scope.row.email || '--' }}</template>
			    </el-table-column>
			  </el-table>
			  <el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="workerListForm.pageNum"
	      :page-sizes="[10,20,30,40,50,60,70,80,90,100, 200]"
	      :page-size="workerListForm.pageSize"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="workerList.total">
	    </el-pagination>
			</div>
		</div>
		
		<!-- 组织架构增删改 -->
		<el-dialog :title="editDepartmentType" :visible.sync="addDepartmentVisible" width="30%">
		  <el-form :model="addDepartmentForm" ref="addDepartmentForm" :rules="addDepartmentRule">
		    <el-form-item v-show="!isEnt" label="上级部门" inline :label-width="formLabelWidth" prop="departParent">
		    	<el-select v-model="addDepartmentForm.departParent">
		    		<el-option v-for="(item, index) in departmentTree" :value="item.id" :label="item.label">{{item.label}}</el-option>
		    	</el-select>
		    </el-form-item>
		    <el-form-item label="部门名称" :label-width="formLabelWidth" prop="departName" required>
		      <el-input v-model="addDepartmentForm.departName" autocomplete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="cancleHandle('addDepartmentVisible','addDepartmentForm')">取 消</el-button>
		    <el-button type="primary" @click="addEditDeSubmit">确 定</el-button>
		  </div>
		</el-dialog>
		<el-dialog title="删除部门" :visible.sync="delDepartmentVisible" width="30%">
			<span>是否确认删除选中部门？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="cancleHandle('delDepartmentVisible')">取 消</el-button>
		    <el-button type="primary" @click="delDeSubmit">确 定</el-button>
		  </span>
		</el-dialog>
		<!-- 用户、坐席增删 -->
		<el-dialog title="增加用户" :visible.sync="addWorkerVisible">
		  <el-form :model="addWorkerForm" ref="addWorkerForm" :rules="addWorkerRule">
		    <el-form-item label="用户名" inline :label-width="formLabelWidth" prop="realName">
		      <el-input v-model="addWorkerForm.realName" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="密码" :label-width="formLabelWidth" prop="passWord">
		      <el-input v-model="addWorkerForm.passWord" type="password" autocomplete="off"></el-input>
		    </el-form-item>
	    <el-form-item label="昵称" :label-width="formLabelWidth" prop="userName">
	      <el-input v-model="addWorkerForm.userName" autocomplete="off"></el-input>
	    </el-form-item>	    
	    <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
	      <el-select v-model="addWorkerForm.sex" placeholder="请选择性别">
		      <el-option label="男" value="男"></el-option>
		      <el-option label="女" value="女"></el-option>
		    </el-select>
	    </el-form-item>	    
	    <el-form-item label="部门" :label-width="formLabelWidth" prop="department">
	      <el-cascader
		    v-model="addWorkerForm.department"
		    :options="departmentTree" :props="addWorkerPositionProps" @change="addWorkerDepartment" :show-all-levels="false">
		    	<template slot-scope="{ node, data }">
				    <span>{{ data.label }}</span>
				    <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
				  </template>
		    </el-cascader>
	    </el-form-item>
	    <el-form-item label="角色" :label-width="formLabelWidth" prop="roleName">
	      <el-select v-model="addWorkerForm.roleName" placeholder="请选择性别">
		      <el-option v-for="item in roleList" :label="item.roleName" value="item.id"></el-option>
		    </el-select>
	    </el-form-item>
	    <el-form-item label="职务" :label-width="formLabelWidth" prop="position">
	    	<el-input v-model="addWorkerForm.position" value="请输入职务"></el-input>
	    </el-form-item>
	    <el-form-item label="用户类别" :label-width="formLabelWidth" prop="userType">
	      <el-select v-model="addWorkerForm.userType" placeholder="请选择性别">
		      <el-option label="坐席组长" value="group"></el-option>
		      <el-option label="坐席" value="seat"></el-option>
		    </el-select>
	    </el-form-item>
	    <el-form-item label="员工编号" :label-width="formLabelWidth" prop="workNo">
	      <el-input v-model="addWorkerForm.workNo" autocomplete="off" type="number"></el-input>
	    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="cancleHandle('addWorkerVisible','addWorkerForm')">取 消</el-button>
		    <el-button type="primary" @click="addUserSubmit">确 定</el-button>
		  </div>
		</el-dialog>
		<el-dialog
		  title="删除用户/坐席"
		  :visible.sync="delWorkerVerifyVisible"
		  width="30%">
		  <span>是否确认删除选中的用户/坐席？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="cancleHandle('delWorkerVerifyVisible')">取 消</el-button>
		    <el-button type="primary" @click="delWorkerVerifyHandle">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
import {getOrganize,addOrganize,delOrganize,editOrganize,getWorkerList,addWorker,delWorker} from '@/api/department.js'
import {loadRoleList} from '@/api/roleset'
import {getLocalStorage} from '@/utils/index'
export default{
	data(){
		return {
			enterpriseName: getLocalStorage('enterpriseName'),
			departmentTree: [],	//组织架构存放
			workerList:{},//员工/坐席列表
			roleList:[],
	    addDepartmentVisible:false,//添加部门visible
	    addDepartmentRule:{
	    	// departParent:[{
	    	// 	required:true,
	    	// 	message:'请选择上级部门',
	    	// 	trigger:'blur'
	    	// }],
	    	departName:[{
	    		required:true,
	    		message:'请输入新增部门名称',
	    		trigger:'blur'
	    	}]
	    },
	    editDepartmentType:'',			
			delDepartmentVisible:false,//删除部门visible
			delDepartmentForm:{
				ids:''
			},
			addWorkerVisible:false,//添加用户visible
			delWorkerVisible:false,//删除用户visible
			delWorkerVerifyVisible:false,//删除用户确认visible
			isEnt:false,
			addDepartmentForm:{
				entUserId:getLocalStorage('userId'),//企业用户ID
				departParent:'',//上级部门（下拉菜单选择）
				departName:''//departName
			},//添加部门表单				
			workerListForm:{//员工/坐席列表参数表单
				pageNum:1,
				pageSize:10,
				entUserId:getLocalStorage('userId'),
				department:''
			},			
			addWorkerForm:{
				entUserId:getLocalStorage('userId'),
				userName:'',
				passWord:'',
				realName:'',
				sex:'',
				department:'',
				email:'',
				position:'',
				userType:'',
				workNo:''
			},
			delWorkerForm:{},
			addWorkerPositionProps:{
				value:'id'
			},	
			addWorkerRule:{
				realName:[
					{
						required:true,message:'请输入员工/坐席姓名',trigger:'blur'
					}
				],
				passWord:[
					{
						required:true,message:'请输入员工/坐席密码',trigger:'blur'
					}
				],
				department:[{
					required:true,message:'请选择员工/坐席所在部门',trigger:'blur'
				}],
				roleName:[{
					required:true,message:'请选择员工/坐席角色',trigger:'blur'
				}],
				userType:[{
					required:true,message:'请选择用户类别',trigger:'blur'
				}]
			},
			formLabelWidth:"100px",
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeSelection:[]//增删改组织架构时判断长度用
		}
	},
	created(){
		//获取组织架构
		this.getOrganizeHandle()
		this.getWorkerHandle()	
		this.loadRoleList()	
	},
	methods:{
		// 取消操作 1、隐藏dialog 2、重置表单
		cancleHandle(visiblePro, formObj){//
			this[visiblePro] = false
			if(formObj){
				this.resetForm(formObj)
			}			
		},
		loadRoleList(){ //加载权限角色
			loadRoleList({entUserId:getLocalStorage('userId')}).then(response=>{
				try{
					if(response.status==200){
						this.roleList = response.data.obj	
					}
				}catch(e){}
			})
		},
		getOrganizeHandle(){//获取组织架构
    	getOrganize({entUserId:getLocalStorage('userId')}).then(response=>{
				this.departmentTree = response.data.obj.data
			})
    },
		nodeClick(obj, data, node){
			this.workerListForm.department = obj.id			
			this.getWorkerHandle()
		},
    addDepartmentHandle(data){//添加部门事件触发
    	this.addDepartmentVisible = true
    	this.addDepartmentForm.departParent = data.parentId
    	if(this.addDepartmentForm.departParent == -1){
    		this.editDepartmentType='添加一级部门'
    		this.isEnt = true
    	}else{
    		this.editDepartmentType='添加部门'
    		this.isEnt = false
    	}
    },
    editDepartmentHandle(data){
    	this.addDepartmentVisible = true
    	this.isEnt = false
    	this.editDepartmentType='编辑部门'
    	let curNode = this.$refs.departmentTree.getCheckedNodes()
    	this.addDepartmentForm.departName = data.label
    	this.addDepartmentForm.departParent = data.parentId
    	this.addDepartmentForm.id = data.id
    },
    delDepartmentVerifyHandle(data){
    	let curNode = this.$refs.departmentTree.getCheckedKeys()
    	if(curNode.length <=0){
    		this.$message.error('请选择要删除的部门')
    	}else{
    		this.delDepartmentForm.ids = curNode  
    		this.delDepartmentVisible = true  		
    	}
    },
    addEditDeSubmit(){
    	this.$refs['addDepartmentForm'].validate((valid)=>{
    		if(valid){
    			if(this.editDepartmentType != '编辑部门'){
    				addOrganize(this.addDepartmentForm).then(response=>{
	    				try{
	    					if(response.status==200){
	    						this.$message.success('部门添加成功')
	    						this.$refs['addDepartmentForm'].resetFields()
	    						this.addDepartmentVisible = false
	    						this.getOrganizeHandle()
	    					}else{
	    						this.$message.error('添加部门失败，请重试')
	    					}
	    				}catch(e){}
	    			})
    			}else{//编辑部门
    				editOrganize(this.addDepartmentForm).then(response=>{
    					try{
	    					if(response.status==200){
	    						this.$message.success('部门编辑成功')
	    						this.$refs['addDepartmentForm'].resetFields()
	    						this.addDepartmentVisible = false
	    						this.getOrganizeHandle()
	    					}else{
	    						this.$message.error('添加部门失败，请重试')
	    					}
	    				}catch(e){}
    				})
    			}
    			
    		}else{
    			this.$message.error('添加部门失败')
    		}
    	})
    },
		delDeSubmit(){
			delOrganize(this.delDepartmentForm).then(response=>{
				if(response.status==200){
  				this.$message.success('删除部门成功')
  				this.delDepartmentVisible = false
  				this.getOrganizeHandle()
  			}
  		})
		},
    handleSelectionChange(val) {//
    	this.delWorkerForm.ids = []
      for(let i in val){
        this.delWorkerForm.ids.push(val[i].id)        
      }
    },
    delWorkerVerifyHandle(){//已确认删除用户
    	delWorker(this.delWorkerForm).then(response=>{
    		try{
    			if(response.status==200){
    				this.delWorkerVerifyVisible = false
    				this.$message.success('删除成功')
    				this.getWorkerHandle()//reload员工列表
    			}
    		}catch(e){

    		}
    	})
    },    
    addWorkerDepartment(val){
    	this.addWorkerForm.department = val[val.length-1]
    },
    getWorkerHandle(){//获取员工列表
    	getWorkerList(this.workerListForm).then(response=>{
    		this.workerList = response.data.obj
    	})
    },
    handleSizeChange(val){
    	this.workerListForm.pageSize = val
    	this.getWorkerHandle()
    },
		handleCurrentChange(val){
			this.workerListForm.pageNum = val
			this.getWorkerHandle()
		},
    addWorkerHandle(){
    	this.addWorkerVisible = true
    },
    cancleAddUser(){
    	this.addWorkerVisible = false
    	this.resetForm('addWorkerForm')
    },
    resetForm(formName){
    	this.$refs[formName].resetFields()
    },
    addUserSubmit(){
    	this.$refs['addWorkerForm'].validate((valid) => {
        if (valid) {
          addWorker(this.addWorkerForm).then(response=>{
		    		try{
		    			if(response.status==200){
		    				this.addWorkerVisible = false
		    				this.$message.success('添加坐席成功！')
		    				this.getWorkerHandle()
		    				this.cancleHandle('addWorkerVisible','addWorkerForm')
		    			}
		    		}catch(e){}
		    	})
        } else {
          console.log('error submit!!');
          return false;
        }
      });    	
    },
		delWorkerHandle(){
			if(!this.delWorkerForm.ids || this.delWorkerForm.ids.length <=0){
				this.$message.error('请选择要删除的用户/坐席')
			}else{
				this.delWorkerVerifyVisible = true
			}
		}
	}
}	
</script>
<style lang="scss" scoped>
.main-box{
	.department-wrap{
		width: 100%;
		display: flex;
	flex-direction: row;
	.department-tree{
		width:18vw;
		.department-handle{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
		.el-tree{
			.custom-tree-node{
				width:100%;
				display: flex;
				flex-direction:row;
				justify-content: space-between;
				span.tree-handle{
					display:none;
					i{
						margin-left:5px;
					}
				}
			}
			.custom-tree-node:hover{
				span.tree-handle{
					display:block;
				}
			}
		}
	}
	.gutter-line{
		border-right:1px solid #ccc;
		margin:0 2vw;
	}
	.department-data{
		display: flex;
		flex-grow:1;
		flex-direction: column;
		.result-handle{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}
	}
	}
	
}
</style>