<template>
  <div class="newcom-wrap">
    <!-- <div class="change-type">
    	<input type="button" class="btn-8032-general" value="企业">
    	<input type="button" class="btn-8032-grey" value="个体">
    </div> -->
    <div class="newcom-main">
      <div class="search-area">
        <dl>
          <dt>线索来源：</dt>
          <dd>
            <el-button>商机推荐</el-button>
            <el-button>企业查询</el-button>
          </dd>
        </dl>
        <dl>
          <dt>所在地区：</dt>
          <dd>
            <template>
              <el-select v-model="value"
                         placeholder="请选择">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </template>
          </dd>
        </dl>
        <dl>
          <dt>企业名称：</dt>
          <dd>
            <el-input placeholder="请输入内容"
                      v-model="input3">
              <el-button slot="append"
                         icon="el-icon-search"></el-button>
            </el-input>
          </dd>
        </dl>
        <div class="search-result">
          <div class="get-data">
            <template>
              <el-select v-model="value"
                         placeholder="请选择">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </template>
            <input class="btn-8032-general"
                   type="button"
                   value="领取">
          </div>
        </div>
      </div>

      <div class="data-list">
        <template>
          <el-table ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column label="日期"
                             width="120">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column prop="name"
                             label="姓名"
                             width="120">
            </el-table-column>
            <el-table-column prop="address"
                             label="地址"
                             show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <!-- <div style="margin-top: 20px">
				    <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
				    <el-button @click="toggleSelection()">取消选择</el-button>
				  </div> -->
        </template>
      </div>
      <el-pagination background
                     layout="prev, pager, next"
                     :total="1000">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: []
    }
  },

  methods: {
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    }
  }
}
</script>
<style lang="scss">
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
        margin-left: 10px;
      }
    }
    div.companyHandle {
      display: flex;
      justify-content: flex-end;
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
