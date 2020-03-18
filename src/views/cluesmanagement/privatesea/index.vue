<template>
  <div class="main-box">
    <div class="search-area">
      <dl>
        <dt>商机状态：</dt>
        <dd>
          <el-radio-group v-model="radiostatus" @change="changeselect">
            <el-radio label="0" border size="medium">待跟进</el-radio>
            <el-radio label="1" border size="medium">有意向</el-radio>
            <el-radio label="2" border size="medium">无意向</el-radio>
            <el-radio label="3" border size="medium">已成交</el-radio>
            <el-radio label="4" border size="medium">未成交</el-radio>
          </el-radio-group>
        </dd>
      </dl>
      <dl>
        <dt>更新时间：</dt>
        <dd>
          <!-- <el-button>今天</el-button>
          <el-button>昨天</el-button>
          <el-button>近七日</el-button> -->
          <el-date-picker v-model="value2" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="timestamp" @change="changeselect()" />
        </dd>
      </dl>
      <dl>
        <dt>内容搜索：</dt>
        <dd>
            <el-select slot="prepend" v-model="typeselect" @change="changeselect()" placeholder="请选择">
              <el-option label="公司名称" value="1" />
              <el-option label="注册地址" value="2" />
              <el-option label="注册资金" value="3" />
            </el-select>
            <el-input v-model="input3" placeholder="请输入内容"></el-input>
        </dd>
      </dl>
      <el-popover
        v-model="visible"
        placement="top"
        width="160"
      >
        <p>这是一段内容这是一段内容确定删除吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button
            size="mini"
            type="text"
            @click="visible = false"
          >取消</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="visible = false"
          >确定</el-button>
        </div>
      </el-popover>
      <div class="companyHandle">
        <el-button
          slot="reference"
          type="info"
          round
          size="medium"
          class="delbtn"
          @click="delclue"
        >删除</el-button>
        <el-button
          slot="reference"
          type="info"
          round
          size="medium"
          @click="dialogFormVisible = true"
        >转移</el-button>
        <el-dialog title="线索转移" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <p>将选择的线索转移到其他用户的线索中</p>
            <el-form-item label="用户名" :label-width="formLabelWidth">
              <el-select v-model="value3" placeholder="请选择用户名">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.listName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editclue">确 定</el-button>
          </div>
        </el-dialog>
        <!-- @click="editclue" -->
        <div class="filter-container">
            <el-checkbox-group v-model="formThead">
                <el-checkbox v-for="(item,index) in  col" :label="item.label" :key="index">
                    {{item.label}}
                </el-checkbox>
            </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="company-data">
      <el-table
        ref="multipleTable"
        :data="myclueinfo"
        header-row-class-name="tableHead"
        :header-cell-style="{background:'#F2F2F2',color:'#666',fontWeight:'400'}"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="godetails"
      >
        <el-table-column type="selection" width="55" />
        <!-- <el-table-column prop="id" label="id" width="50" /> -->
        <el-table-column prop="entName" label="企业名称" show-overflow-tooltip @click="a" />
        <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="regDate" label="成立时间" show-overflow-tooltip />
        <el-table-column prop="regCapital" label="注册资本(万元)" show-overflow-tooltip>
          <template slot-scope="scope">
            {{Math.floor(scope.row.regCapital)}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="联系人">
          <template slot-scope="scope">{{scope.row.name || '--'}}</template>
        </el-table-column>
        <el-table-column prop="contact" label="联系方式" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.contact || '--'}}</template>
        </el-table-column>
        <el-table-column prop="lastFollowTime" label="最后跟进时间" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.lastFollowTime | parseDateTime}}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="收藏时间" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.updateTime | parseDateTime}}
          </template>
        </el-table-column>
        
        
        <el-table-column prop="dataSource" label="线索来源" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-show="scope.row.dataSource == 0">新企推荐</span>
            <span v-show="scope.row.dataSource == 1">企业搜索</span>
            <span v-show="scope.row.dataSource == 2">转线索</span>
            <span v-show="scope.row.dataSource == 3">回收站</span>
          </template>
        </el-table-column>
        <el-table-column prop="clueStatus" property="clueStatus" label="线索状态" show-overflow-tooltip>
          <template slot-scope="status">
            <span v-if="status.row.clueStatus == 0">待跟进</span>
            <span v-if="status.row.clueStatus == 1">有意向</span>
            <span v-if="status.row.clueStatus == 2">无意向</span>
            <span v-if="status.row.clueStatus == 3">已成交</span>
            <span v-if="status.row.clueStatus == 4">未成交</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column prop="wechat" label="微信" show-overflow-tooltip />
        <el-table-column prop="email" label="邮箱" show-overflow-tooltip />
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { getLocalStorage } from '@/utils/index'
let parseDateTime = Vue.filter('parseDateTime')
export default {
  name: 'CompanyList',
  data() {
    return {
      radiostatus: '',
      myclueinfo: {},
      dialogFormVisible: false,
      form: {},
      formLabelWidth: '120px',
      value3: null,
      entName: '',
      input3:'',
      pickerOptions: {
        shortcuts: [{
          text: '最近一天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      typeselect: '',
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: '',
      multipleSelection: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      visible: false,
      ids: {}
    }
  },
  watch: {
  },
  created() {
    this.searchclue()
    this.searchlist()
  },
  methods: {
    handleSizeChange(pageSize){
      this.pageSize = pageSize
      this.searchclue()
    },
    handleCurrentChange(pageNum){
      this.pageNum = pageNum
      this.searchclue()
    },
    godetails(val) {
      let thisdata = this
      thisdata = val
      this.$router.push({
        path: 'details',
        query: {
          id: val.id
        }
      })
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.searchclue()
    },
    searchclue(data) {      
      if (data) {
        data.pageNum = this.pageNum
        data.pageSize = this.pageSize
      } else {
        data = { 'pageNum': this.pageNum, 'pageSize': this.pageSize }
      }
      data.userId = getLocalStorage('userId')
      this.$store.dispatch('myclue/cluessearch', data)
        .then((res) => {
          this.myclueinfo = res.obj.list
          this.total = res.obj.total
        })
        .catch(() => {
        })
    },
    searchlist() {
      this.$store.dispatch('recycle/selectList', { 'entUserId': 1 })
        .then((res) => {
          this.options = res.obj
        })
        .catch(() => {
        })
    },
    delclue() {
      this.$refs.multipleTable.selection
      var ids = []
      for (var id in this.$refs.multipleTable.selection) {
        ids.push(this.$refs.multipleTable.selection[id].id)
      }
      ids = ids.join(',')
      this.ids = { ids: ids }
      // console.log(this.ids)
      if (ids.length == 0) {
      } else {
        this.$confirm('确认删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('myclue/cluesdel', this.ids)
            .then((res) => {
              this.searchclue()
            })
            .catch((error) => {
              console.log(error)
            })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.searchclue()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
        this.searchclue()
      }
    },
    editclue() {
      this.$refs.multipleTable.selection
      var ids = []
      for (var id in this.$refs.multipleTable.selection) {
        ids.push(this.$refs.multipleTable.selection[id].id)
      }
      ids = ids.join(',')
      if (!this.value3) {
        this.$message({
          type: 'info',
          message: '请选择名单!'
        })
      } else {
        if (ids.length == 0) {
          this.$message({
            type: 'info',
            message: '请选择要转移的线索!'
          })
          return
        } else {
          this.$store.dispatch('myclue/cluesedit', { 'ids': ids, 'listId': this.value3 })
            .then((res) => {
              this.searchclue()
              this.dialogFormVisible = false
            })
            .catch((error) => {
              console.log(error)
            })
        }
      }
    },

    changeselect() {
      this.searchclue({ 'clueStatus': this.radiostatus, 'type': this.typeselect, 'content': this.input3, 'startTime': this.value2[0]/1000, 'endTime': this.value2[1]/1000 })
    }
  }
}
</script>
<style lang="scss">
.company-data{
  margin-top: 20px;
}
.el-button{
  box-shadow:0px 2px 4px 0px rgba(43,97,187,0.5);
}
.delbtn{
  background:linear-gradient(-23deg,#4088FF,#406DFF);
}
.is-circle{
  box-shadow: none;
  border: none;
}
.search-area {
  display: flex;
  flex-direction: column;
  dl {
    display: flex;
    flex-direction: row;
    align-items: center;
    dd {
      margin-left: 10px;
      display: flex;
      justify-content: flex-start
    }
  }
  div.companyHandle {
    display: flex;
    justify-content: flex-end;
  }
}
.el-pagination {
  margin-top: 20px;
}
.search-area /deep/ .el-input-group__prepend{
      width: 125px;
}
.el-radio{
  margin-right: 8px;
  margin-left: 0!important;
}
.el-input-group{
  background: none;
}
.search-area /deep/ .el-radio__inner{
  display: none;
}
.main-box /deep/.el-radio.is-bordered.is-checked{
  border: none;
  background: #6699FF;
  }
.main-box /deep/.el-radio.is-bordered.is-checked span{
color: #FFF;
}
.main-box /deep/.el-input-group__prepend{
  background: none;
}
.main-box /deep/ el-input-group__append{
  background: none;
}
.el-radio--medium.is-bordered{
  padding:12px 20px 0 10px
}
</style>
