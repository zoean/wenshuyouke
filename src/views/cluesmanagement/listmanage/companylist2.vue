<template>
  <div class="main-box">
    <div class="search-area">
      <dl class="backToList highblue" @click="backToList">返回名单列表</dl>      
      <dl>
        <dt>商机状态：</dt>
        <dd>
          <el-checkbox-group v-model="businessStatus">
            <el-checkbox-button v-for="state in status" :label="status" :key="status">{{state}}</el-checkbox-button>
          </el-checkbox-group>
          <el-button>转线索</el-button>
          <el-button>已触达</el-button>
          <el-button>待触达</el-button>
        </dd>
      </dl>
      <dl>
        <dt>线索状态：</dt>
        <dd>
          <el-button>转线索</el-button>
          <el-button>已触达</el-button>
          <el-button>待触达</el-button>
        </dd>
      </dl>
      <div class="companyHandle">
        <el-button slot="reference"
                   type="primary"
                   round
                   size="medium">领取</el-button>
        <el-button slot="reference"
                   type="info"
                   round
                   size="medium">删除</el-button>
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
      <!-- <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage4"
                     :page-sizes="[100, 200, 300, 400]"
                     :page-size="100"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="400">
      </el-pagination> -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'CompanyList',
  props:{
    curCardId:{
      type:String,
      default:null
    }
  },
  created(){
    console.log(this.status)
  },
  data () {
    return {
      status: ['转线索','已触达', '待触达'],
      businessStatus:[]
    }
  },
  created(){    
    console.log(this.curCardId) 
  },
  method:{
    backToList(){ //返回名单列表组件
      this.changeCom()
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
  dl.backToList{
    text-align: center;
    cursor: pointer;
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
