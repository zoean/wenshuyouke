<template>
	<div class="main-box">
		<div class="role-panel">
			<div class="role-handle">
				<h3>公司角色</h3>
				<p>
					<el-button type="primary" icon="el-icon-plus" circle @click="addRoleHandle"></el-button>
						<el-button type="primary" icon="el-icon-edit" circle @click="editRoleHandle"></el-button>
						<el-button type="danger" icon="el-icon-delete" circle @click="delRoleHandle"></el-button>
				</p>
			</div>
			<div class="role-list">
				<el-tabs :tab-position="tabPosition" style="height: 200px;" :tab-click="roleSelection">
			    <el-tab-pane label="用户管理">用户管理</el-tab-pane>
			    <el-tab-pane label="配置管理">配置管理</el-tab-pane>
			    <el-tab-pane label="角色管理">角色管理</el-tab-pane>
			    <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
			  </el-tabs>
			</div>
		</div>
		<div class="role-set">
			<h2>权限设置-最高管理员</h2>
		</div>
		<el-dialog title="增加角色" ：visible.sync="addRoleVisible">
			<el-form ref="addRoleForm">
				<el-form-item prop="">
					<el-input></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
		    <el-button @click="cancleHandle('addRoleVisible','addRoleForm')">取 消</el-button>
		    <el-button type="primary" @click="addRoleHandle">确 定</el-button>
		  </div>
		</el-dialog>
		<el-dialog title="编辑角色名称" ：visible.sync="editRoleVisible">
			<el-form ref="editRoleForm">
				<el-form-item prop="">
					<el-input disabled></el-input>
				</el-form-item>
				<el-form-item prop="">
					<el-input></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
		    <el-button @click="cancleHandle('editRoleVisible','editRoleForm')">取 消</el-button>
		    <el-button type="primary" @click="editRoleHandle">确 定</el-button>
		  </div>
		</el-dialog>

		<el-dialog title="删除角色确认" ：visible.sync="delRoleVisible">
			<p>正在删除【管理员】角色</p>
			<p>该角色删除后无法恢复</p>
		</el-dialog>
		<div slot="footer" class="dialog-footer">
	    <el-button @click="cancleHandle('delRoleVisible')">取 消</el-button>
	    <el-button type="primary" @click="delRoleHandle">确 定</el-button>
	  </div>
	</div>
</template>
<script>
import {loadRoleList} from '@/api/roleset'
import {getLocalStorage} from '@/utils/index'
export default{
	data(){
		return {
			roleList:[],
			roleForm:{
				ids:[]
			},
			addRoleVisible:false,
			editRoleVisible:false,
			delRoleVisible:false,
			addRoleForm:{},
			editRoleForm:{}
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
						this.roleList = response.data.obj.list
					}
				}catch(e){}
			})
		},
		roleSelection(data){
			this.roleForm.ids=[]
			for(let i in data){
				this.roleForm.ids.push(data[i].id)
			}
		},
		addRoleHandle(){},
		delRoleHandle(){},

		// 取消操作 1、隐藏dialog 2、重置表单
		cancleHandle(visiblePro, formObj){//
			this[visiblePro] = false
			if(formObj){
				this.resetForm(formObj)
			}			
		}

	}
}	
</script>
<style lang="scss">
.main-box{
	display: flex;
	flex-direction: row;

}
</style>