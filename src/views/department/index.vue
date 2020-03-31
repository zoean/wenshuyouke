<template>
  <div class="main-box">
    <div class="department-wrap">
      <div class="department-tree">
        <div class="department-handle">
          <h3>{{enterpriseName}}</h3>
          <p class="highblue" @click="addFirstDepartmentHandle">添加一级部门</p>
        </div>
        <el-tree :check-on-click-node=true :accordion=false ref="departmentTree" highlight-current :expand-on-click-node="false" default-expand-all show-checkbox :data="departmentTree" :props="defaultProps" show-checkbox :default-expand-all="true" node-key="id" @node-click="nodeClick" :check-strictly="false">
					<span class="custom-tree-node" slot-scope="{ node, data }">
		        <span>{{ node.label}}</span>
		        <span class="tree-handle">
		        	<i class="el-icon-plus" title="添加下属部门" v-show="data.parentId < 2" @click="addEditHandle(data)"></i>
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
            prop="userName"
            label="分配帐号"
            show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.userName }}</template>
          </el-table-column>
          <el-table-column
            prop="realName"
            label="姓名">
            <template slot-scope="scope">{{ scope.row.realName }}</template>
          </el-table-column>
          <el-table-column
            prop="userType"
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
            prop="sex"
            label="性别"
            show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.sex }}</template>
          </el-table-column>
          <el-table-column
            prop="department"
            label="部门"
            show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.department }}</template>
          </el-table-column>
          <el-table-column
            prop="position"
            label="职务"
            show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.position }}</template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.phone }}</template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="editWorkerHandle(scope.row)">编辑</el-button>
            </template>
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
    <el-dialog :title="editDepartmentType" :visible.sync="addEditVisible" width="30%">
      <el-form :model="addEditForm" ref="addEditForm" :rules="addEditRule">
        <el-form-item v-show="!isEnt" label="上级部门" inline :label-width="formLabelWidth" prop="departParent">
          <el-select v-model="addEditForm.departParent">
            <el-option v-for="(item, index) in departmentTree" :value="item.id" :label="item.label">{{item.label}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" :label-width="formLabelWidth" prop="departName" required>
          <el-input v-model="addEditForm.departName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleHandle('addEditVisible','addEditForm')">取 消</el-button>
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
    <el-dialog :title="addEditType" :visible.sync="addEditWorkerVisible" width="30%">
      <el-form :model="addEditWorkerForm" ref="addEditWorkerForm" :rules="addEditWorkerRule">
        <el-form-item label="登录名" inline :label-width="formLabelWidth" prop="userName">
          <el-input v-model="addEditWorkerForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-show="addEditType=='添加用户'" label="密码" :label-width="formLabelWidth" prop="passWord">
          <el-input v-model="addEditWorkerForm.passWord" type="password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" placeholder="请输入手机号" prop="phone">
          <el-input v-model="addEditWorkerForm.phone" type="tel" max-size="11"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="realName">
          <el-input v-model="addEditWorkerForm.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-select v-model="addEditWorkerForm.sex" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth" prop="department">
          <el-cascader
            v-model="addEditWorkerForm.department"
            :options="departmentTree" :props="addWorkerPositionProps" @change="addWorkerDepartment" :show-all-levels="true">
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" prop="userRole">
          <el-select v-model="addEditWorkerForm.userRole" placeholder="请选择性别">
            <el-option v-for="item in roleList" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务" :label-width="formLabelWidth" prop="position">
          <el-input v-model="addEditWorkerForm.position" value="请输入职务"></el-input>
        </el-form-item>
        <!-- <el-form-item label="员工编号" :label-width="formLabelWidth" prop="workNo">
          <el-input v-model="addEditWorkerForm.workNo" autocomplete="off" type="number"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleHandle('addEditWorkerVisible','addEditWorkerForm')">取 消</el-button>
        <el-button type="primary" @click="addEditUserSubmit">确 定</el-button>
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
  import {getOrganize,addOrganize,delOrganize,editOrganize,getWorkerList,addWorker,delWorker, editWorker} from '@/api/department.js'
  import {loadRoleList} from '@/api/roleset'
  import {getLocalStorage} from '@/utils/index'
  export default{
    data(){
      return {
        enterpriseName: getLocalStorage('enterpriseName'),
        departmentTree: [],	//组织架构存放
        workerList:{},//员工/坐席列表
        roleList:[],
        addEditVisible:false,//添加部门visible
        addEditRule:{
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
        addEditWorkerVisible:false,//添加用户visible
        delWorkerVisible:false,//删除用户visible
        delWorkerVerifyVisible:false,//删除用户确认visible
        isEnt:false,
        addEditForm:{
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
        addEditWorkerForm:{
          entUserId:getLocalStorage('userId'),
          userName:'',
          passWord:'',
          realName:'',
          sex:'',
          department:'',
          email:'',
          position:'',
          userType:'seat',
          workNo:''
        },
        delWorkerForm:{},
        addWorkerPositionProps:{
          value:'id'
        },
        addEditWorkerRule:{
          userName:[{
            required: true, message:'请输入登录名', trigger: 'blur'
          }],
          realName:[
            {
              required: true, message:'请输入员工/坐席姓名',trigger:'blur'
            }
          ],
          passWord:[ // 添加用户时密码必填，编辑用户时不作此校验
            {
              required: this.addEditType == '添加用户' ? true : false,message:'请输入员工/坐席密码',trigger:'blur'
            }
          ],
          phone:[{
            required:true, message: '请输入坐席手机号码',trigger:'blur'
          }],
          department:[{
            required:true,message:'请选择员工/坐席所在部门',trigger:'blur'
          }],
          userRole:[{
            required:true,message:'请选择员工/坐席角色',trigger:'blur'
          }]
        },
        addEditType: '', //操作类型：编辑 添加
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
      cancleHandle(visiblePro, formObj){
        this[visiblePro] = false
        if(formObj){
          this.$refs[formObj].resetFields()
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
      addEditHandle(data){//添加部门事件触发
        this.addEditVisible = true
        this.addEditForm.departParent = data.id
        this.editDepartmentType='添加部门'
        this.isEnt = false
      },
      addFirstDepartmentHandle(){ //添加一级部门表单不显示上级部门
        this.addEditVisible = true
        this.addEditForm.departParent = -1
        this.editDepartmentType = '添加一级部门'
        this.isEnt = true
      },
      editDepartmentHandle(data){
        this.isEnt = data.parentId == -1 ? true : false //如果编辑一级部门表单不显示上级部门
        this.addEditVisible = true
        // this.isEnt = false
        this.editDepartmentType='编辑部门'
        let curNode = this.$refs.departmentTree.getCheckedNodes()
        this.addEditForm.departName = data.label
        this.addEditForm.departParent = data.parentId
        this.addEditForm.id = data.id
      },
      delDepartmentVerifyHandle(data){
        // let curNode = this.$refs.departmentTree.getCheckedKeys()
        let curNode = data.id
        if(curNode.length <=0){
          this.$message.error('请选择要删除的部门')
        }else{
          this.delDepartmentForm.ids = curNode
          this.delDepartmentVisible = true
        }
      },
      addEditFormReset(){ // 添加和编辑用户/坐席共用表单，需要添加前清空表单数据再resetfields
        this.addEditWorkerForm = {
          entUserId:getLocalStorage('userId'),
          userName:'',
          passWord:'',
          realName:'',
          sex:'',
          department:'',
          email:'',
          position:'',
          userType:'seat',
          workNo:'',
          id: ''
        }
      },
      addEditDeSubmit(){
        this.$refs['addEditForm'].validate((valid)=>{
          if(valid){
            if(this.editDepartmentType != '编辑部门'){
              addOrganize(this.addEditForm).then(response=>{
                try{
                  if(response.status==200){
                    this.$message.success('部门添加成功')
                    this.$refs['addEditForm'].resetFields()
                    this.addEditVisible = false
                    this.getOrganizeHandle()
                    this.getWorkerHandle()//reload员工列表
                    this.getWorkerList()
                  }else{
                    this.$message.error('添加部门失败，请重试')
                  }
                }catch(e){}
              })
            }else{//编辑部门
              editOrganize(this.addEditForm).then(response=>{
                try{
                  if(response.status==200){
                    this.$message.success('部门编辑成功')
                    this.$refs['addEditForm'].resetFields()
                    this.addEditVisible = false
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
            this.getWorkerHandle()//reload员工列表
            this.getWorkerList()
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
              this.getWorkerList()
            }
          }catch(e){

          }
        })
      },
      addWorkerDepartment(val){
        console.log(val)
        this.addEditWorkerForm.department = val[val.length-1]
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
        this.addEditWorkerVisible = true
        this.addEditType = '添加用户'
        this.addEditFormReset()
        // this.$refs['addEditWorkerForm'].resetFields()
      },
      editWorkerHandle(data){
        this.addEditWorkerVisible = true
        this.addEditType = '编辑用户'
        let departmentLable = data.department
        let departmentArray = []
        // cascader 回显部门处理，只处理两级，如果多于两级需要改写成递归函数
        this.departmentTree.map(item => {
          if(item.label == departmentLable){
            departmentArray.push(item.id)
          }else if(item.children && item.children.length > 0){
            for( let i in item.children){
              if(item.children[i].label == departmentLable){
                departmentArray.push(item.children[i].parentId)
                departmentArray.push(item.children[i].id)
              }
            }
          }
        })
        this.addEditWorkerForm = {
          userName: data.userName,
          realName: data.realName,
          sex: data.sex,
          phone: data.phone,
          department: departmentArray,
          userRole: data.userRole,
          position: data.position,
          id: data.id
        }
      },
      addEditUserSubmit(){
        this.$refs['addEditWorkerForm'].validate((valid) => {
          if (valid) {
            if(this.addEditType == '添加用户'){
              addWorker(this.addEditWorkerForm).then(response=>{
                try{
                  if(response.status==200){
                    this.addEditWorkerVisible = false
                    this.$message.success('添加用户成功！')
                    this.workerListForm.department = this.addEditWorkerForm.department
                    this.getWorkerHandle()
                    this.cancleHandle('addEditWorkerVisible','addEditWorkerForm')
                  }
                }catch(e){}
              })
            }else{
              // el-cascader回显需要Array类型，传值需要String叶子节点传值之前需要pop拿到叶子节点
              this.addEditWorkerForm.department = this.addEditWorkerForm.department.pop()
              editWorker(this.addEditWorkerForm).then(response=>{
                try{
                  if(response.status==200){
                    this.addEditWorkerVisible = false
                    this.$message.success('用户编辑成功！')
                    this.getWorkerHandle()
                    this.cancleHandle('addEditWorkerVisible','addEditWorkerForm')
                  }
                }catch(e){}
              })
            }
          }
        })
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
          p{
            cursor:pointer;
          }
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
