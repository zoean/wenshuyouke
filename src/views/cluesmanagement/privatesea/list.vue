<template>
  <div class="main-box">
    <div class="search-area">
      <dl>
        <dt>商机状态：</dt>
        <dd>
          <el-checkbox-group v-model="searchForm.fllowupStatus" @change="selectStatus">
            <el-checkbox
              border
              v-for="(status,index) in fllowupStatus"
              :label="index"
              :key="status"
              :value="index"
            >{{status}}</el-checkbox>
          </el-checkbox-group>
        </dd>
      </dl>
      <dl>
        <dt>更新时间：</dt>
        <dd>
          <el-date-picker
            v-model="selecttime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            value-format="timestamp"
            @change="selectTime()"
          />
        </dd>
      </dl>
      <dl>
        <dt>内容搜索：</dt>
        <dd>
          <template>
            <el-select slot="prepend" v-model="searchForm.type" placeholder="请选择">
              <el-option label="公司名称" value="1" />
              <el-option label="注册地址" value="2" />
              <el-option label="注册资金" value="3" />
            </el-select>
          </template>
          <el-input v-model="searchForm.content" placeholder="请输入内容" />
        </dd>
      </dl>
      <div class="companyHandle">
        <p>您当前有<b class="highred">{{total}}</b>条线索</p>
        <div>
        <el-select v-model="moveClueToCardForm.listId" placeholder="请选择名单">
          <el-option
            v-for="item in curUserCardList"
            :key="item.id"
            :label="item.listName"
            :value="item.id"
          />
        </el-select>
        <el-button
          slot="reference"
          type="primary"
          round
          @click="editclue"
        >转移</el-button>
        <!-- 功能待添加 -->
        <!-- <el-button
          slot="reference"
          type="primary"
          round
        >导出</el-button> -->
        <el-button
          slot="reference"
          type="info"
          round
          @click="delclue"
        >删除</el-button>
        </div>
      </div>
    </div>
    <div class="company-data">
      <el-table
        ref="multipleTable"
        :data="myclueinfo"
        header-row-class-name="tableHead"
        :header-cell-style="{color:'#666',fontWeight:'400'}"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @cell-click="godetails"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="entName" label="企业名称">
          <template slot-scope="companyName">
            <p :title="companyName.row.entName">{{companyName.row.entName | ellipsis(20)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip />
        <el-table-column prop="legalName" label="联系人" />
        <el-table-column prop="updateTime" label="收藏时间" show-overflow-tooltip :formatter="formatDate" />
        <el-table-column
          prop="lastFollowTime"
          label="最后跟进时间"
          show-overflow-tooltip
        />
        <el-table-column prop="dataSource" label="线索来源" show-overflow-tooltip>
          <template slot-scope="status">
            <span v-if="status.row.dataSource == 0">新企推荐</span>
            <span v-if="status.row.dataSource == 1">企业查询</span>
            <span v-if="status.row.dataSource == 2">转线索</span>
            <span v-if="status.row.dataSource == 3">回收站</span>
          </template>
        </el-table-column>
        <el-table-column prop="clueStatus" label="线索状态" show-overflow-tooltip>
          <template slot-scope="status">
            <span v-if="status.row.fllowupStatus == 0">待跟进</span>
            <span v-if="status.row.fllowupStatus == 1">有意向</span>
            <span v-if="status.row.fllowupStatus == 2">无意向</span>
            <span v-if="status.row.fllowupStatus == 3">已成交</span>
            <span v-if="status.row.fllowupStatus == 4">未成交</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="searchForm.pageNum"
        :page-size="searchForm.pageSize"
        :total="total"
      />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { getLocalStorage } from "@/utils/index"
import { parseToTimestamp, parseTime, parseDateTime } from "@/utils/index"
import { getCurUserCard, getNewComToCard } from "@/api/foundclues"
let ellipsis = Vue.filter('ellipsis')//引入全局filter

export default {
  name:'CompanyList',
		props:{
			changeCom:{
				type:Function,
				default:null
			},
			setCListId:{
				type:Function,
				default:null
			},
      showDetail: {
        type: Boolean
      }
		},
    mouted(){
      console.log('列表页')
    },
  data() {
    return {
      fllowupStatus: ["待跟进", "有意向", "无意向", "已成交", "未成交"],
      curUserCardList: [], //当前用户的名单列表
      searchForm: {
        userId: getLocalStorage("userId"),
        fllowupStatus: [], //商机状态
        startTime: "", //开始时间
        endTime: "", // 结束时间
        type: "", //内容搜索类型
        content: "",
        pageNum: 1,
        pageSize: 10
      },
      moveClueToCardForm: {
        dataSource: 2,
        listId: '',
        entId: [] //选取的线索列表
      },
      myclueinfo: [],
      dialogFormVisible: false,
      delClueForm: {
        ids:[]
      },
      form: {},
      formLabelWidth: "120px",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      selecttime: [],
      total: 0,
      visible: false,
      ids: {}
    };
  },
  watch: {
    searchForm: {
      handler: function(val, oldval) {
        //监听回调
        this.searchclue();
      },
      deep: true //开启深度监听
    },
    showDetail: {
      handler: function (val){
        // this.fetchCardList()
      }
    }
  },
  created() {
    this.searchclue();
    this.fetchCardList();
  },
  methods: {
    fetchCardList() {
      //获取当前用户名单列表用于线索转移
      getCurUserCard({ entUserId: getLocalStorage("userId") }).then(
        response => {
          this.curUserCardList = response.data.obj;
        }
      );
    },
    selectStatus(val) {
      //选择线索来源-将状态处理为状态对应id
      this.searchForm.fllowupStatus = val;
    },
    timerStart() {
      this.timer = setInterval(() => {
        ++this.time;
        this.formateTime();
      }, 1000);
    },
    formateTime() {
      let h = parseInt(this.time / 3600);
      let m = parseInt((this.time - h * 3600) / 60);
      let s = this.time - h * 3600 - m * 60;
      // 格式化
      h < 10 ? (h = `0${h}`) : "";
      m < 10 ? (m = `0${m}`) : "";
      s < 10 ? (s = `0${s}`) : "";
      this.countTime = `${h}:${m}:${s}`;
    },
    formatDate(row, column, cellValue, index){
      return cellValue ? parseDateTime(cellValue) : ''
    },
    timerClear() {
      this.timer = null;
    },
    handleSizeChange(pageSize) {
      this.searchForm.pageSize = pageSize;
    },
    handleCurrentChange(pageNum) {
      this.searchForm.pageNum = pageNum;
    },
    handleSelectionChange(val) {
      //获取标签选取id用于线索转移
      this.moveClueToCardForm.entId = [];
      this.delClueForm.ids = []
      for (let i in val) {
        this.moveClueToCardForm.entId.push(val[i].id)
        this.delClueForm.ids.push(val[i].id)
      }
    },
    selectTime(val) {
      this.searchForm.startTime = parseToTimestamp(val[0], 10);
      this.searchForm.endTime = parseToTimestamp(val[1], 10);
    },
    searchclue() { //获取我的线索列表
      this.$store
        .dispatch("myclue/cluessearch", this.searchForm)
        .then(res => {
          if (res.status == 200) {
            this.myclueinfo = res.obj.list;
            this.total = res.obj.total;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    delclue() {
      let ids = this.delClueForm.ids.join(",")
      if (ids.length == 0) {
      } else {
        this.$confirm("确认删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$store
              .dispatch("myclue/cluesdel", {ids: ids})
              .then(res => {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.searchclue();
              })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    editclue() {
      this.$refs.multipleTable.selection;
      var ids = [];
      for (var id in this.$refs.multipleTable.selection) {
        ids.push(this.$refs.multipleTable.selection[id].id)
      }
      ids = ids.join(",")
      if(!this.moveClueToCardForm.listId){
        this.$message.error('请选择目标名单')
      }else if(!this.moveClueToCardForm.entId || !this.moveClueToCardForm.entId.length){
        this.$message.error('请选择要转移的线索')
      }else{
        this.$store
          .dispatch("myclue/cluesedit", {ids: ids, dataSource: 2, listId: this.moveClueToCardForm.listId})
          .then(res => {
            this.searchclue();
            this.dialogFormVisible = false;
          }).catch(error => {
            console.log(error);
          })
      }
      // if (!this.listId) {
      //   this.$message({
      //     type: "error",
      //     message: "请选择名单!"
      //   })
      // } else if(ids.length == 0){
      //   this.$message({
      //     type: "info",
      //     message: "请选择要转移的线索!"
      //   });
      // } else {
      //   this.$store
      //     .dispatch("myclue/cluesedit", { ids: ids, listId: this.listId })
      //     .then(res => {
      //       this.searchclue();
      //       this.dialogFormVisible = false;
      //     }).catch(error => {
      //       console.log(error);
      //     })
      // }
    },
    godetails(row,column,event,cell) {
      this.changeCom()
      this.$store.commit('myclue/SET_COMPANYID', row.id)
    }
  }
};
</script>
<style lang="scss" scoped>
.is-circle {
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
      display: inherit;
      .el-select {
        display: inline;
        margin-right: 8px;
        cursor:pointer;
      }
    }
  }
  .el-checkbox {
    margin-right: 8px;
    margin-left: 0 !important;
    .is-bordered {
      padding: 12px 20px 0 10px;
    }
  }
  .companyHandle{
    justify-content: space-between;
  }
}
.el-table >>> tr.el-table__row{
    cursor: pointer;
}
.search-area /deep/ .el-input-group__prepend {
  width: 125px;
}

.el-input-group {
  background: none;
}
.search-area /deep/ .el-checkbox__inner {
  display: none;
}
.main-box /deep/.el-checkbox.is-bordered.is-checked {
  border: none;
  background: #6699ff;
}
.main-box /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #fff;
}
.main-box /deep/.el-input-group__prepend {
  background: none;
}
.main-box /deep/ el-input-group__append {
  background: none;
}
</style>
