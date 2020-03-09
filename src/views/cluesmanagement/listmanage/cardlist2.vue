<template>
<!--  <div class="list-wrap">
    <div class="list-search">
      <el-input type="text" name="" placeholder="请输入查询内容"></el-input>
      <input class="btn-8032-general" type="button" name="" value="查询">
    </div>
    <div class="list-card">
      <ul>
        <li class="first-card">
          <i class="el-icon-plus"></i>
          <p @click="dialogFormVisible = true">点击新建名单</p>
          <el-dialog title="修改名称" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="名单原名称：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="名单现名称：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button>取 消</el-button>
              <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog title="编辑规则" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="榜单规则：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="名单现名称：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <p>添加规则</p>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button>取 消</el-button>
              <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
          </el-dialog>
          <!-- <el-dialog title="新建名单" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="名单名称：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="定时任务：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="分配给：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="分配给：" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button>取 消</el-button>
              <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
          </el-dialog> -->
          <el-dialog title="新建名单" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="名单名称：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="定时任务：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="分配给：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="分配给：" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button>取 消</el-button>
              <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
          </el-dialog>
        </li>
        <li>
          <el-switch
            v-model="value1"
            inactive-text="按年付费">
          </el-switch>
          <h2>北京地区销售名单</h2>
          <p>2020-11-01 11:10</p>
          <template>
            <el-select v-model="value" placeholder="请添加子帐户">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <dl>
            <dt><span>新增</span>/现存：<span>122</span>/1000</dt>
            <dd>
              <el-dropdown placement="top" @command="handleCommand">
                <span class="svg-container el-dropdown-link">
                <svg-icon icon-class="more" />
              </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">修改名称</el-dropdown-item>
                  <el-dropdown-item command="2">编辑规则</el-dropdown-item>
                  <el-dropdown-item command="3">删除名单</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </dd>
          </dl>
        </li>
        <li>
          <el-switch
            v-model="value1"
            inactive-text="按年付费">
          </el-switch>
          <h2>北京地区销售名单</h2>
          <p>2020-11-01 11:10</p>
          <template>
            <el-select v-model="value" placeholder="请添加子帐户">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <dl>
            <dt><span>新增</span>/现存：<span>122</span>/1000</dt>
            <dd>
              <span class="svg-container">
                <svg-icon icon-class="more" />
              </span>
            </dd>
          </dl>
        </li>
        <li>
          <el-switch
            v-model="value1"
            inactive-text="按年付费">
          </el-switch>
          <h2>北京地区销售名单</h2>
          <p>2020-11-01 11:10</p>
          <template>
            <el-select v-model="value" placeholder="请添加子帐户">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <dl>
            <dt><span>新增</span>/现存：<span>122</span>/1000</dt>
            <dd>
              <span class="svg-container">
                <svg-icon icon-class="more" />
              </span>
            </dd>
          </dl>
        </li>
        <li>
          <el-switch
            v-model="value1"
            inactive-text="按年付费">
          </el-switch>
          <h2>北京地区销售名单</h2>
          <p>2020-11-01 11:10</p>
          <template>
            <el-select v-model="value" placeholder="请添加子帐户">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <dl>
            <dt><span>新增</span>/现存：<span>122</span>/1000</dt>
            <dd>
              <span class="svg-container">
                <svg-icon icon-class="more" />
              </span>
            </dd>
          </dl>
        </li>
        <li>
          <el-switch
            v-model="value1"
            inactive-text="按年付费">
          </el-switch>
          <h2>北京地区销售名单</h2>
          <p>2020-11-01 11:10</p>
          <template>
            <el-select v-model="value" placeholder="请添加子帐户">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <dl>
            <dt><span>新增</span>/现存：<span>122</span>/1000</dt>
            <dd>
              <span class="svg-container">
                <svg-icon icon-class="more" />
              </span>
            </dd>
          </dl>
        </li>
        <li>
          <el-switch
            v-model="value1"
            inactive-text="按年付费">
          </el-switch>
          <h2>北京地区销售名单</h2>
          <p>2020-11-01 11:10</p>
          <template>
            <el-select v-model="value" placeholder="请添加子帐户">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <dl>
            <dt><span>新增</span>/现存：<span>122</span>/1000</dt>
            <dd>
              <span class="svg-container">
                <svg-icon icon-class="more" />
              </span>
            </dd>
          </dl>
        </li>
        <li>
          <el-switch
            v-model="value1"
            inactive-text="按年付费">
          </el-switch>
          <h2>北京地区销售名单</h2>
          <p>2020-11-01 11:10</p>
          <template>
            <el-select v-model="value" placeholder="请添加子帐户">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <dl>
            <dt><span>新增</span>/现存：<span>122</span>/1000</dt>
            <dd>
              <span class="svg-container">
                <svg-icon icon-class="more" />
              </span>
            </dd>
          </dl>
        </li>
        <li>
          <el-switch
            v-model="value1"
            inactive-text="按年付费">
          </el-switch>
          <h2>北京地区销售名单</h2>
          <p>2020-11-01 11:10</p>
          <template>
            <el-select v-model="value" placeholder="请添加子帐户">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <dl>
            <dt><span>新增</span>/现存：<span>122</span>/1000</dt>
            <dd>
              <span class="svg-container">
                <svg-icon icon-class="more" />
              </span>
            </dd>
          </dl>
        </li>
        <li>
          <el-switch
            v-model="value1"
            inactive-text="按年付费">
          </el-switch>
          <h2>北京地区销售名单</h2>
          <p>2020-11-01 11:10</p>
          <template>
            <el-select v-model="value" placeholder="请添加子帐户">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <dl>
            <dt><span>新增</span>/现存：<span>122</span>/1000</dt>
            <dd>
              <span class="svg-container">
                <svg-icon icon-class="more" />
              </span>
            </dd>
          </dl>
        </li>
      </ul>
      <!-- <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="活动名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="活动区域" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog> -->
    </div>
  </div>
 
</template>
<script>
  export default{
    name:"CardList",
    data(){
      return{
        value1: true,
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
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      }
    },
    methods:{
      handleCommand(command) {
        this.$message('click on item ' + command);
        this.dialogFormVisible = true
        // if(command==2){
        //  this.dialogFormVisible=true
        // }
      }
    }
  }
</script>
<style lang="scss">
  .list-search{
    display: flex;
    align-items: center;
    .el-input{
      width:200px;
      margin-right: 20px;
    }
  }
  .list-card{
    ul{
      width: 100%;
      display: flex;
      align-content: flex-start;
      flex-wrap:wrap;
      flex-grow: 1;
      li{
        width:400px;
        height:440px;
        padding:16px;
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 6px 0px #d3e5ff;
        border-radius:12px;
        margin:13px 13px 13px 0;
        flex-direction: column;
        .el-switch{
          display: flex;
          justify-content: flex-end;
        }
        h2{
          color: #4386FE;
          font-size: 30px;
          text-align: center;
          margin-top: 62px;
        }
        .el-select{
          margin:80px 0 0 110px;
          width: 160px;
        }
        p{
          text-align: center;
        }
        dl{
          margin-top: 95px;
          display: flex;
          justify-content: space-between;
          flex-direction: row;
          dt{
            span{
              color: #CC0000
            }
          }
        }
      }
      li.first-card{
        i.el-icon-plus{
          font-size: 40px;
          color: #ccc;
          margin: 160px 0 110px 165px;
          text-align: center;
        }
        p{
          color: #4084FF;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
</style>