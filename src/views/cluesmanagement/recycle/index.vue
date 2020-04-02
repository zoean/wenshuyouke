<template>
  <div class="newcom-wrap">
    <!-- <div class="change-type">
    	<input type="button" class="btn-8032-general" value="企业">
    	<input type="button" class="btn-8032-grey" value="个体">
    </div> -->
    <div class="newcom-main">
      <div class="search-area">
        <dl>
          <dt>企业名称：</dt>
          <dd>
            <el-input
              v-model="entName"
              placeholder="请输入内容"
              @input="changeEntName()"
            />
          </dd>
          </dl>
          <dl>
          <dt>来源名单：</dt>
          <dd>
            <template>
              <el-select
                v-model="value1"
                placeholder="请选择"
                @change="changeEntName()"
              >
                <el-option>全部</el-option>
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.listName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </dd>
        </dl>
        <div class="search-result companyHandle">
          <p>当前有<b class="highred">{{total}}</b>条线索存放至回收站</p>
          <div class="get-data">
            <input
              class="btn-8032-general"
              type="button"
              value="领取"
              @click="receive()"
            >
          </div>
        </div>
      </div>

      <div class="data-list">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            :header-cell-style="{background:'#F2F2F2',color:'#666',fontWeight:'400'}"
            style="margin-top: 20px;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="entName"
              label="企业名称"
              show-overflow-tooltip
            />
            <el-table-column
              prop="regDate"
              label="成立时间"
            />
            <el-table-column
              prop="chargeMan"
              label="负责人"
            />
            </el-table-column>
            <el-table-column
              prop="dataSource"
              label="线索来源" :formatter="dataSource"
            />
            <el-table-column
              prop="lastFollowTime"
              :formatter="formatDate"
              width="180"
              label="最后跟进时间"
            />
            <el-table-column
              prop="fllowupStatus"
              label="跟进状态" :formatter="followStatus"
            />
            <el-table-column
              prop="updateTime"
              :formatter="formatDate"
              label="收藏时间"
            />
            <el-table-column
              prop="remark"
              label="备注"
            />
          </el-table>
          <!-- <div style="margin-top: 20px">
            <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
            <el-button @click="toggleSelection()">取消选择</el-button>
          </div> -->
        </template>
      </div>
      <el-pagination
        layout="total,prev, pager, next,jumper"
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>  
import Vue from 'vue'
import { getLocalStorage, parseTime,parseDateTime } from '@/utils/index'
import {postCluesToSelf} from '@/api/saleslead'
export default {
  data() {
    return {
      options: [],
      tableData: [],
      multipleSelection: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      value1: '',
      value2: '',
      entName: ''
    }
  },
  created() {
    this.searchclue()
    this.searchlist()
  },
  methods: {
    dataSource(row, column, cellValue){
      switch (cellValue) {
        case 1:
          return '企业搜索'
          break
        case 2:
          return '转线索'
          break
        case 3:
          return '回收站'
          break
        default:
          return '新企推荐'
          break
      }
    },
    followStatus(row, column, cellValue){
      switch (cellValue) {
        case 1:
          return '有意向'
          break
        case 2:
          return '无意向'
          break
        case 3:
          return '已成交'
          break
        case 4:
          return '未成交'
          break
        default:
          return '待跟进'
          break
      }
    },
    searchclue(data) {
      if (data) {
        data.pageNum = this.pageNum
        data.pageSize = this.pageSize
      } else {
        data = { 'pageNum': this.pageNum, 'pageSize': this.pageSize }
      }
      this.$store.dispatch('recycle/select', data)
        .then((res) => {
          this.tableData = res.obj.list
          this.total = res.obj.total
          // console.log(res.obj.list)
        })
        .catch(() => {
        })
    },
    searchlist() {

      this.$store.dispatch('recycle/selectList', {"entUserId":getLocalStorage('userId')})
      // this.$store.dispatch('recycle/selectList', { 'entUserId': 1 })
        .then((res) => {
          this.options = res.obj
        })
        .catch(() => {
        })
    },
    receive() {
      var idArr = this.multipleSelection
      if(!idArr){
        this.$message.error('请选择要转移的线索')
      }else{
        let ids = []
        for(let i in idArr){
          ids.push(idArr[i].id)
        }
        postCluesToSelf({entId: ids,dataSource:'3'}).then(response => {
          if(response.data.status == 200){
            this.$message.success(response.data.obj)
            this.searchclue()
          }else{
            this.$message.error(response.data.obj)
          }
        })
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.searchclue()
    },
    changeEntName() {
      this.searchclue({ 'entName': this.entName, 'listId': this.value1 })
    },
    formatDate(row, column, cellValue) { // 表格时间列格式化
      return parseDateTime(cellValue)
    }
  }
}
</script>
<style lang="scss" scoped>
.newcom-wrap {
  width: 100%;
  color: #666;
  display: flex;
  flex-direction: column;
  .search-area {
    display: flex;
    flex-direction: column;
    dl {
      display: flex;
      flex-direction: row;
      align-items: center;
      dd {
        margin:0 20px 0 10px;
      }
    }
    div.companyHandle {
      display: flex;
      justify-content: space-between;
    }
  }
  .change-type {
    input {
      margin-right: 14px;
    }
  }
  .newcom-main {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 7px 1px rgba(211, 229, 255, 1);
    border-radius: 12px;
    margin-top: 16px;
    padding: 22px 32px;
    .open-search {
      background: rgba(244, 244, 244, 1);
      border: 1px solid rgba(230, 230, 230, 1);
      border-radius: 12px;
      text-align: center;
      color: #4083ff;
      text-decoration: underline;
      line-height: 64px;
      font-size: 14px;
    }
    .get-data {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-select {
        margin-right: 10px;
      }
    }
    .el-pagination {
      margin-top: 20px;
    }
  }
}
</style>
