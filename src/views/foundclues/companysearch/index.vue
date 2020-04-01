<template>
  <div>
    <div class="search">
      <el-input v-model="searchForm.entName" placeholder="请输入企业名关键词" class="input-with-select">
        <el-button slot="append" @click="searchlist">搜索</el-button>
      </el-input>
    </div>
    <div class="main-box results">
      <div class="criteria search-area">
        <dl>
          <dt>所在地区：</dt>
          <dd>
          <el-button type="primary" @click="clearcity" class="btn-blue-default">不限</el-button>
          <el-select v-model="pname" placeholder="省级地区" @change="choseProvince">
            <el-option v-for="index in province" :label="index.name" :value="index.id" />
          </el-select>
          <el-select v-model="cname" placeholder="市级地区" @change="choseCity">
            <el-option v-for="index in city" :label="index.name" :value="index.id" />
          </el-select>
          <el-select v-model="bname" @change="choseBlock" placeholder="区级地区">
            <el-option v-for="index in block" :label="index.name" :value="index.id" />
          </el-select>
        </dd>
        </dl>
        <dl>
          <dt>所属行业：</dt>
          <dd>
            <el-button type="primary" @click="clearindustry" class="btn-blue-default">不限</el-button>
            <el-select v-model="categoryname" placeholder="一级" @change="choseCategory">
              <el-option v-for="index in Category" :label="index.industryName" :value="index.industryCode" />
            </el-select>
            <el-select v-model="industry" placeholder="二级" @change="choseIndustry">
              <el-option v-for="index in Industry" :label="index.industryName" :value="index.industryCode" />
            </el-select>
          </dd>
        </dl>
        <dl>
          <dt>企业类型：</dt>
          <dd>
            <el-radio-group v-model="searchForm.entType">
              <el-radio
                style="margin-right:0"
                v-for="index in entType"
                :label="index.value"
                :key="index.value"
                border
                size="medium"
              >{{index.label}}</el-radio>
            </el-radio-group>
          </dd>
        </dl>
        <dl>
          <dt>联系方式：</dt>
          <dd>
            <el-radio-group v-model="searchForm.telePhone">
              <el-radio
                style="margin-right:0"
                v-for="index in telePhone"
                :label="index.value"
                :key="index.value"
                border
                size="medium"
              >{{index.label}}</el-radio>
            </el-radio-group>
          </dd>
        </dl>
        <dl>
          <dt>注册资本：</dt>
          <dd>
            <el-radio-group v-model="searchForm.regCapital">
                <el-radio v-for="index in regCapital"
                  style="margin-right:0"
                  :label="index.value"
                  :key="index.value"
                  :title="index.title"
                  border
                  size="medium"
                >{{index.label}}</el-radio>
            </el-radio-group>
          </dd>
        </dl>
      </div>
      <el-row class="general">
        <el-col :span="12">
          本次搜索共为您检测到 <b class="highred">{{companytotal}}</b> 家符合标准的企业
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-select v-model="curListId" placeholder="请选择">
              <el-option v-for="index in listId" :key="index.id"
                :label="index.listName"
                :value="index.id"
              />
            </el-select>
          <el-button type="primary" @click="receives" round>领取</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="companydata"
        ref="companydataTable"
        stripe
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="entName" label="公司名称" width="280"></el-table-column>
        <el-table-column label="法人">
          <template slot-scope="scope">{{scope.row.legalName}}</template>
        </el-table-column>
        <el-table-column label="成立时间" sortable
              :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.regDate}}</template>
        </el-table-column>
        <el-table-column label="注册资本" sortable 
              :sort-method="sortRegCapital">
          <template slot-scope="scope">{{Math.floor(scope.row.regCapital)}}万元</template>
        </el-table-column>
        <el-table-column width="380" label="地址">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="searchForm.pageNum"
        :page-size="searchForm.pageSize"
        :total="companytotal"
      />
    </div>
  </div>
</template>
<script>
import { parseToTimestamp, parseTime } from "@/utils/index";
import { getLocalStorage } from "@/utils/index";

export default {
  data() {
    return {
      entType: [ { value: "", label: "不限" }, { value: "个人独资企业", label: "个人独资企业" },{ value: "有限责任公司", label: "有限责任公司" },{ value: "股份有限公司", label: "股份有限公司" },{ value: "外商投资企业", label: "外商投资企业" },{ value: "1", label: "其他" } ],
      telePhone: [{value :"2",label:"不限"},{value:"0",label:"无"},{value:"1",label:"有"} ],
      regCapital: [ { value: "0", label: "不限",title:"不限" },{ value: "1", label: "20万以下" ,title:"包含20万"},{ value: "2", label: "20-50万",title:"不包含20万" },{ value: "3", label: "50-100万" ,title:"不包含50万" },{ value: "4", label: "100-200万" ,title:"不包含100万" },{ value: "5", label: "200-500万" ,title:"不包含200万" },{ value: "6", label: "500万以上",title:"包含500万"  }],
      searchForm: {
        userId: getLocalStorage("userId"),
        entName: "", //企业名字
        entType: "", //企业类型
        regCapital: "0", // 注册资本
        telePhone: "2", //联系方式
        industryCode: "", //行业
        pid:"",
        pageNum: 1,
        pageSize: 10
      },
      listId:'',
      curListId: '',
      province: [],
      city: [],
      block: [],
      pname: "", // 省的名字
      cname: "", // 市的名字
      bname: "", //区的名字
      categoryname: "",
      industry: "",
      Category: [],
      Industry: [],
      dialogVisible: false,
      companydata: [],
      chosecity:'',
      rowinfo: {},
      companytotal:0,
      entIds:[]
      // props:{}
    };
  },
  watch: {
    searchForm: {
      handler: function(val, oldval) {
        //监听回调
        this.companylist();
      },
      deep: true //开启深度监听
    }
  },
  created() {
    this.choseProvince();
    this.choseCategory()
    this.companylist();
    this.searchlist()
  },
  methods: {
    sortRegCapital(a,b){
      return a.regCapital - b.regCapital
    },
    sortByDate(a,b){
      return a.verifiedTime - b.verifiedTime
    },
    load () {
        this.loading = true
        setTimeout(() => {
          this.searchForm.pageNum +=1
          this.loading = false
        }, 2000)
    this.companylist(this.searchForm);
      },
    changeValue(value) {
        // console.log(value);
        let obj = {};
        obj = this.entType.find((index)=>{
            return index.value === value;
        });
        // console.log(obj.label);
    },
    clearcity() {
      this.pname = "";
      this.cname = "";
      this.bname = "";
      this.searchForm.pid = '';
      this.ProvinceNoLimit()
    },
    clearindustry() {
      this.categoryname = "";
      this.industry = "";
      this.searchForm.industryCode = '';
      this.ProvinceNoLimit()
    },
    // 选省
    choseProvince() {
      const pid = 100000;
      this.cname = "";
      this.bname = "";
      this.block = []
      this.choseprovince = { pid: pid };
      this.$store
        .dispatch("companysearch/area", this.choseprovince)
        .then(res => {
          if(res){
            this.province = res.obj;
            this.searchForm.pid = this.pname
          }
        })
        .catch(() => {});
      if (this.pname) {
        this.pid = { pid: this.pname };
        this.choseCity(this.pid);
      }
    },
    // 选市
    choseCity() {
      this.bname = "";
      this.$store
        .dispatch("companysearch/area", this.pid)
        .then(res => {
          if(res){
            this.city = res.obj;
            this.searchForm.pid = this.cname
          }
        })
        .catch(() => {});
      if (this.cname) {
        this.cid = { pid: this.cname };
        this.choseBlock(this.cid);
      }
    },
    // 选区
    choseBlock() {
      this.$store.dispatch("companysearch/area", this.cid).then(res => {
          if(res){
            this.block = res.obj;
            this.searchForm.pid = this.bname
          }
      });
    },
    //不限
    ProvinceNoLimit() {
      this.$store
      .dispatch("companysearch/companysearch",this.searchForm)
      // .dispatch("myclue/cluessearch",this.searchForm)
        .then(res => {
            if(res){
              this.companydata = res.obj.list;
              this.companytotal = res.obj.total
            }
        })
        .catch(() => {});
    },
    //一级行业
    choseCategory(){
      this.industry = "";
      this.$store
        .dispatch("companysearch/category")
        .then(res => {
            if(res){
              this.Category = res.obj;
              this.searchForm.industryCode = this.categoryname

            }
        })
        .catch(() => {});
        if (this.categoryname) {
          this.industryid = { "industryCode": this.categoryname};
          console.log(this.industryid)
          this.choseIndustry(this.industryid);
        }
    },
    //二级行业
    choseIndustry() {
      this.$store
      .dispatch("companysearch/industry",this.industryid)
        .then(res => {
            if(res){
              this.Industry = res.obj;
              this.searchForm.industryCode = this.industry
            }
        })
        .catch(() => {});
    },
    //公司信息展示
    companylist() {
       this.$store
      .dispatch("companysearch/companysearch",this.searchForm)
      // .dispatch("myclue/cluessearch",this.searchForm)
        .then(res => {
            if(res){
              this.companydata = res.obj.list;
              this.companytotal = res.obj.total
            }
        })
        .catch(() => {});
    },
    handleSizeChange(pageSize) {
      this.searchForm.pageSize = pageSize;
    },
    handleCurrentChange(pageNum) {
      this.searchForm.pageNum = pageNum;
    },
    // companyinfoshow(row) {
    //   this.dialogVisible = true;
    //   this.rowid = {id:row.id}
    //   this.$store
    //   .dispatch("companysearch/searchinfo",this.rowid)
    //     .then(res => {
    //         if(res){
    //           this.rowinfo = res.obj
    //           if(rowinfo.enterpriseLogo){
    //             this.rowinfo.enterpriseLogo = rowinfo.enterpriseLogo
    //           }else{
    //             this.rowinfo.enterpriseLogo = require('@/assets/images/companylogo.png')
    //           }
    //         }
    //     })
    //     .catch(() => {});
      
    // },
    searchlist() {
      this.$store.dispatch('recycle/selectList', {"entUserId":getLocalStorage('userId')})
      // this.$store.dispatch('recycle/selectList', { 'entUserId': 3 })
        .then((res) => {
          this.listId = res.obj
        })
        .catch(() => {
        })
    },
    receives() {
      let ids = this.$refs.companydataTable.selection
      if (!this.curListId) {
        this.$message.error('请选择目标名单')
      }else if(!ids || !ids.length){
        this.$message.error('请选择要转移的线索')
      }else{
        var entIdsArr = []
        for (var id in ids) {
          entIdsArr.push(ids[id].id);
        }
        this.$store.dispatch('companysearch/addClueManager', { 'entId': entIdsArr, 'listId': this.curListId,'dataSource':2 })
        .then((res) => {
          if (res.message == 'success') {
            this.$message.success(res.obj)
            this.companylist();
          } else {
            this.$message.success('领取失败')
          }
        })
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
}
</script>
<style lang="scss">



</style>
<style lang="scss" scoped>
.search{
  margin: 40px auto;
  width: 80%;
}
.el-radio__inner {
  display: none;
}
.search-area >>>.el-radio.is-bordered.is-checked {
  border: none;
  background: #6699ff;
}
.search-area >>>.el-radio.is-bordered.is-checked span {
  color: #fff;
}

.search-area >>> .el-radio__input{
  display: none;
}
.search-area >>> .el-radio{
  padding: 0 20px 0 10px;
  text-align:center;
  line-height: 36px;
  height: 36px;
  min-width: 100px;
  margin-right:0;
}
.search-area{
  dl{
    dt{
      width:100px;
      display:block
    }
    dd{
      .el-button--primary{
        padding: 0
      }
    }
  }
} 
.results {
  .criteria {
    .el-row {
      margin-bottom: 15px;
      .el-radio {
        margin-right: 8px;
        margin-left: 0px;
        text-align: center;
        min-width: 100px;
        height: 36px;
      }
      
      .el-select {
        margin-right: 4px;
        margin-left: 0px;
      }
    }
  }
  .general {
    color: #999999;
    margin: 33px 0 16px;
    line-height:40px;
    .el-button {
      width: 80px;
      padding: 0;
      height: 36px;
      font-size: 14px;
      line-height: 36px;
      background: linear-gradient(-23deg, #4088ff, #406dff);
      box-shadow: 0px 2px 4px 0px rgba(43, 97, 187, 0.5);
      margin-left: 10px;
    }
  }
}
</style>
