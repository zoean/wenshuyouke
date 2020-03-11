<template>
  <div class="main-box">
    <div class="search-area">      
      <dl>
        <dt>商机来源：</dt>
        <dd>
          <el-checkbox-group v-model="searchForm.businessStatus" @change="statusArray()">
            <el-checkbox-button v-for="state in status" :label="state" :key="state">{{state}}</el-checkbox-button>
          </el-checkbox-group>
        </dd>
      </dl>
      <dl>
        <dt>更新时间：</dt>
        <dd>
          <el-date-picker v-model="searchForm.updateTime"
                          type="datetimerange"
                          :picker-options="pickerOptions"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          align="right"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          @change="pickerDate">
          </el-date-picker>
        </dd>
      </dl>
      <dl>
        <dt>查询条件：</dt>
        <dd>
          <template>
            <el-select v-model="subAccount"
                       placeholder="请选择">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </template>
        </dd>
        <dd>
          <template>
            <el-select v-model="subAccountList"
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
        <dt>内容搜索：</dt>
        <dd>
          <el-input placeholder="请输入内容"
                    v-model="searContent">
            <el-button slot="append"
                       icon="el-icon-search"></el-button>
          </el-input>
        </dd>
      </dl>
      <div class="companyHandle">
        <p>本次更新<span class="highred">788</span>条，更新时间为12-02</p>
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
          <el-button slot="reference"
                     type="primary"
                     round>转移至线索池</el-button>
        </el-popover>
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
    <div class="saleslead-data">
      <el-dialog :show-close="false"
                 class="call-duration"
                 :visible.sync="callDurationVisible"
                 width="20%">
        <p class="call-company highblue">北京文投大数据</p>
        <p class="call-company-duration">01:39</p>
        <el-button type="danger"
                   round>挂断</el-button>
      </el-dialog>
      <el-dialog class="add-clues highblue"
                 title="新增线索"
                 :visible.sync="addCluesVisible"
                 :modal="false"
                 width="500px">
        <el-form label-width="100px">
          <el-form-item label="姓名：">
            <el-input v-model="input"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="公司名称：">
            <el-input v-model="input"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="电话：">
            <el-input v-model="input"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="textarea"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
        <el-row type="flex"
                justify="end">
          <el-col :span="4">
            <el-button size="small"
                       type="info"
                       round>取消</el-button>
          </el-col>
          <el-col :span="4">
            <el-button size="small"
                       type="primary"
                       round>保存</el-button>
          </el-col>
        </el-row>

      </el-dialog>
      <el-table ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column label="号码"
                         width="180">
          <template slot-scope="scope">
            <el-button type="success"
                       round
                       @click="oneTouchCall">一键呼叫</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name"
                         label="名片">
          <template>
            <el-row>
              <el-col :span="6">
                <h2 class="highblue">文投大数据</h2>
              </el-col>
              <el-col :span="18">李鲜花|1992-01-01|100000万元</el-col>
            </el-row>
            <div class="com-lable">
              <span>
                <span class="label-blue">地址</span>
                <span>北京市石景山</span>
              </span>
              <span class="label-dark-gray">未拨打</span>
              <span class="label-light-gray">拨打记录：2020-09-09</span>
              <span class="label-light-gray">来源：新企推荐</span>
              <span class="label-light-gray">备注：这里是备注</span>
            </div>
          </template>
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
      status: ['转线索','已触达', '待触达'],
      searchForm:{
        businessStatus:[],//商机状态
        updateTime:'',//更新时间
        subAccount:'',// 查询条件-子帐户
        subAccountList:'',//查询条件-子帐户名单
        searContent:''//查询条件
      },
      addCluesVisible: false,
      callDurationVisible: false,
      items: [
        { type: '', label: '标签一' },
        { type: 'success', label: '标签二' },
        { type: 'info', label: '标签三' },
        { type: 'danger', label: '标签四' },
        { type: 'warning', label: '标签五' }
      ],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
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
      items: []
    }
  },
  watch:{//监听搜索条件变化，请求数据
    searchForm:{
      handler:function(val,oldval){//监听回调
        console.log(this.searchForm)
      },
      deep: true //开启深度监听
    }
  },
  methods: {
    oneTouchCall () {
      this.addCluesVisible = true
      this.callDurationVisible = true
    },
    statusArray(){
      console.log(this.searchForm.businessStatus)
    },
    pickerDate(value){
      console.log(this.searchForm.updateTime)
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
  .companyHandle {
    display: flex;
    justify-content: space-between;
  }
}
.saleslead-data {
  .call-duration {
    text-align: center;
    .el-dialog {
      left: -20%;
    }
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 10px 20px;
    }
    .call-company {
      font-size: 24px;
    }
    .el-button {
      padding: 10px 40px;
    }
  }
  .add-clues {
    z-index: 2022;
    .el-dialog {
      left: 10%;
    }
  }
  .el-row {
    display: flex;
    align-items: center;
    .el-col {
      h2 {
        font-size: 24px;
        font-weight: 100;
      }
    }
  }
  .com-lable {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
.el-pagination {
  margin-top: 20px;
}
</style>
