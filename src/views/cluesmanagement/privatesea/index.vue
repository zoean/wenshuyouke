<template>
  <div class="main-box">
    <div class="search-area">
      <dl>
        <dt>商机状态：</dt>
        <dd>
          <el-button>转跟进</el-button>
          <el-button type="primary">有意向</el-button>
          <el-button>无意向</el-button>
          <el-button>已成交</el-button>
          <el-button>未成交</el-button>
        </dd>
      </dl>
      <dl>
        <dt>更新时间：</dt>
        <dd>
          <el-button>今天</el-button>
          <el-button>昨天</el-button>
          <el-button>近七日</el-button>
          <el-date-picker v-model="value2"
                          type="datetimerange"
                          :picker-options="pickerOptions"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          align="right">
          </el-date-picker>
        </dd>
      </dl>
      <dl>
        <dt>内容搜索：</dt>
        <dd>
          <el-input placeholder="请输入内容"
                    v-model="input3">
            <el-button slot="append"
                       icon="el-icon-search"></el-button>
          </el-input>
        </dd>
      </dl>
      <el-popover placement="top"
                  width="160"
                  v-model="visible">
        <p>这是一段内容这是一段内容确定删除吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini"
                     type="text"
                     @click="visible = false">取消</el-button>
          <el-button type="primary"
                     size="mini"
                     @click="visible = false">确定</el-button>
        </div>
      </el-popover>
      <div class="companyHandle">
        <el-button slot="reference"
                   type="primary"
                   round
                   size="medium">领取</el-button>
        <el-button slot="reference"
                   type="info"
                   round
                   size="medium">删除</el-button>
        <el-button slot="reference"
                   type="info"
                   round
                   size="medium">转移</el-button>

        <!-- <el-popover
				  placement="top"
				  width="160"
				  v-model="visible">
				  <p>这是一段内容这是一段内容确定删除吗？</p>
				  <div style="text-align: right; margin: 0">
				    <el-button size="mini" type="text" @click="visible = false">取消</el-button>
				    <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
				  </div>
				  <el-button slot="reference">删除</el-button>
				</el-popover>	 -->
      </div>
    </div>
    <div class="company-data">
      <el-table ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column label="企业名称"
                         width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="name"
                         label="领取时间"
                         width="120">
        </el-table-column>
        <el-table-column prop="address"
                         label="最后跟进时间"
                         show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage4"
                     :page-sizes="[100, 200, 300, 400]"
                     :page-size="100"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="400">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CompanyList',
  data () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: '',
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
      multipleSelection: [],
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      visible: false,
    }
  }
}
</script>
<style lang="scss">
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
.el-pagination {
  margin-top: 20px;
}
</style>
