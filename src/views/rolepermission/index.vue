<template>
	<div class="main-box">
		<div class="role-panel">
			<div class="role-handle">
				<h3>{{entUserName}}</h3>
				<p>
					<el-button type="primary" icon="el-icon-plus" circle @click="addRoleHandle"></el-button>
						<el-button type="primary" icon="el-icon-edit" circle @click="editRoleHandle"></el-button>
						<el-button type="danger" icon="el-icon-delete" circle @click="delRoleHandle"></el-button>
				</p>
			</div>
			<div class="role-list">
				<el-tabs :tab-position="tabPosition" @tab-click="roleSelection">
			    <el-tab-pane v-for="(item,index) in roleList" :label="item.roleName"></el-tab-pane>
			  </el-tabs>
			</div>
		</div>
		<div class="gutter-line"></div>
		<div class="role-set">
			<h2>权限设置</h2>
			<el-tree
			  :data="menuTree"
			  show-checkbox
			  node-key="id"
			  :default-checked-keys="curUserRoleList"
			  :props="defaultProps"
			  ref="roleTree">
			</el-tree>
			<el-row type="flex" justify="end">
				<el-col :span="4">
					<el-button type="primary" @click="saveRoleSet">保存</el-button>
				</el-col>
			</el-row>
		</div>
		 <el-dialog :title="addEditRoleType" :visible.sync="addEditRoleVisible" width="30%">
			<el-form :model="addEditRoleForm" ref="addEditRoleForm" :rules="addEditRoleRule">
				<el-form-item label="角色名称：" inline :label-width="formLabelWidth" prop="roleName">
					<el-input v-model="addEditRoleForm.roleName" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
		    <el-button @click="cancleHandle('addEditRoleVisible','addEditRoleForm')">取 消</el-button>
		    <el-button type="primary" @click="addEditRoleSubmit">确 定</el-button>
		  </div>
		</el-dialog>
		<el-dialog title="删除角色确认" :visible.sync="delRoleVisibel" width="30%">
			<p>正在删除【{{addEditRoleForm.roleName}}】角色</p>
			<p>该角色删除后无法恢复</p>
			<div slot="footer" class="dialog-footer">
		    <el-button @click="cancleHandle('delRoleVisibel')">取 消</el-button>
		    <el-button type="primary" @click="delRoleSubmit">确 定</el-button>
		  </div>
		</el-dialog>		
	</div>
</template>
<script>
import {loadRoleList,addRole,editRole,delRole,getRoleTree,setRoleTree} from '@/api/roleset'
import {getLocalStorage} from '@/utils/index'
export default{
	data(){
		return {
			entUserName:getLocalStorage('enterpriseName'),
			formLabelWidth:"100px",
			tabPosition:'left',
			roleList:[],
			roleId:'',
			roleType: '',
			menuTree:[],
			addEditRoleType:'',
			addEditRoleVisible:false,
			delRoleVisibel:false,
			addEditRoleForm:{
				entUserId: getLocalStorage('userId'),
				id: '0',
				roleName: ''
			},
			addEditRoleRule:{
				roleName:[{
					required:true,
					message:'请输入角色名称',
					trigger:'blur'
				}]
			},
			curUserRoleList:[],
			defaultProps: {
        children: 'children',
        label: 'label'
      },
      setCurRoleTreeForm:{
      	ids: []
      }
		}
	},
	created(){
		this.loadRoleList()
	},
	methods:{
		loadRoleList(){ //加载权限角色
			loadRoleList({entUserId:getLocalStorage('userId')}).then(response=>{
				try{
					if(response.status==200){
						this.roleList = response.data.obj		
						this.roleId = this.roleList[0].id
						this.roleType = this.roleList[0].roleType
						this.loadRoleTree()
					}
				}catch(e){}
			})
		},
		loadRoleTree(){	
			console.log(this.roleId)
			getRoleTree({roleId: this.roleId, menuRole: this.roleType}).then(response => {
				this.menuTree = response.data.obj.menus				
				this.curUserRoleList = response.data.obj.keys	
			})
		},
		roleSelection(tab,event){
			this.addEditRoleForm.roleName = tab.label
			this.addEditRoleForm.id = this.roleList[tab.index].id
			this.addEditRoleForm.roleType = this.roleList[tab.index].roleType
			this.roleId = this.roleList[tab.index].id
			this.roleType = this.roleList[tab.index].roleType
			this.loadRoleTree()
		},
		addRoleHandle(){
			this.addEditRoleType="添加角色"
			this.addEditRoleVisible = true
			this.addEditRoleForm.roleName=""
			this.addEditRoleForm.id=""
		},
		editRoleHandle(){
			this.addEditRoleType="编辑角色"
			this.addEditRoleVisible = true
			if(!this.addEditRoleForm.roleName){
				this.addEditRoleForm.roleName = this.roleList[0].roleName
				this.addEditRoleForm.id = this.roleList[0].id
			}
		},		
		delRoleHandle(){
			if(!this.addEditRoleForm.roleName){
				this.addEditRoleForm.roleName = this.roleList[0].roleName
				this.addEditRoleForm.id = this.roleList[0].id
			}
			this.delRoleVisibel = true
		},
		delRoleSubmit(){
			delRole(this.addEditRoleForm).then(response =>{
				if(response.status == 200){
    			this.$message.success('角色删除成功')
    			this.loadRoleList()
    			this.delRoleVisibel = false
    		}
			})
		},
		addEditRoleSubmit(){
			this.$refs['addEditRoleForm'].validate((valid) => {
        if (valid) {
          if(this.addEditRoleType=="添加角色"){
          	addRole(this.addEditRoleForm).then(response => {
          		if(response.status == 200){
          			this.$message.success('添加角色成功')
          			this.loadRoleList()
          			this.cancleHandle('addEditRoleVisible','addEditRoleForm')
          		}
          	})
          }else{
          	editRole(this.addEditRoleForm).then(response => {
          		if(response.status == 200){
          			this.$message.success('角色编辑成功')
          			this.loadRoleList()  
          			this.cancleHandle('addEditRoleVisible','addEditRoleForm')
          		}
          	})
          }
        } else {
          this.$message.error('请输入角色名称')
          return false;
        }
      });
		},
		// 取消操作 1、隐藏dialog 2、重置表单
		cancleHandle(visiblePro, formObj){//
			this[visiblePro] = false
			if(formObj){
				this.$refs[formObj].resetFields()
			}			
		},
		saveRoleSet(){
			// let curKeys = this.$refs.roleTree.getCheckedKeys()
			let curNodes = this.$refs.roleTree.getCheckedNodes()
			if(!curNodes || curNodes.length <=0){
				this.$message.error('请为该角色选择权限菜单')
			}else{
				this.setCurRoleTreeForm.roleId = this.roleId
				for(let i in curNodes){
					if(!this.setCurRoleTreeForm.ids.includes(curNodes[i].id)){//传子节点id
						this.setCurRoleTreeForm.ids.push(curNodes[i].id)
					}
					if(!this.setCurRoleTreeForm.ids.includes(curNodes[i].parentId)){//传父节点id
						this.setCurRoleTreeForm.ids.push(curNodes[i].parentId)
					}
				}
				setRoleTree(this.setCurRoleTreeForm).then(response=>{
					if(response.status == 200){
						this.$message.success('权限设置成功')
						this.setCurRoleTreeForm.ids = []
					}
				})
			}
			// 只传子节点id
			// if(!curKeys || curKeys.length <=0){
			// 	this.$message.error('请为该角色选择权限菜单')
			// }else{
			// 	this.setCurRoleTreeForm.roleId = this.roleId
			// 	this.setCurRoleTreeForm.ids = curKeys
			// 	setRoleTree(this.setCurRoleTreeForm).then(response=>{
			// 		if(response.status == 200){
			// 			this.$message.success('权限设置成功')
			// 		}
			// 	})
			// }
		}
	}
}	
</script>
<style lang="scss">
.role-list{
	.el-tabs{
		div.el-tabs__header{
			width:100% !important;
			.el-tabs__item{
				text-align:left;
				height:50px;
				line-height: 50px;					
			}
			div.is-active{
				background:#409EFF;
				color:#fff;
			}
		}
	}
}
</style>
<style lang="scss" scoped>
.main-box{
	display: flex;
	flex-direction: row;
	.role-panel{
		width:22vw;
		.role-handle{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}
	.gutter-line{
		border-right:1px solid #ccc;
		margin:0 2vw;
	}
	.role-set{
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
</style>