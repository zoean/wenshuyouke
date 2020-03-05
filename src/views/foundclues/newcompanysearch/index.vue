<template>
  <div class="newcom-wrap">
    <!-- <div class="change-type">
    	<input type="button" class="btn-8032-general" value="企业">
    	<input type="button" class="btn-8032-grey" value="个体">
    </div> -->
    <div class="newcom-main">
    	<p class="open-search">点击打开搜索条件</p>
    	<div class="search-area">
				<div class="if-all-cond">
					<span>下列条件满足：</span>
					<template>
					  <el-radio v-model="radio" label="1">备选项</el-radio>
					  <el-radio v-model="radio" label="2">备选项</el-radio>
					</template>
				</div>
    	</div>
    	<div class="search-result">
    		<span>文投优客今天为您推荐了<b>330</b>家符合条件的企业</span>
    		<div class="get-data">
	    		<template>
					  <el-select v-model="value" placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
					</template>			
	    		<input class="btn-8032-general" type="button" value="领取">
	    	</div>
    	</div>
    	<div class="data-list">
    		<template>
				  <el-table
				    ref="multipleTable"
				    :data="tableData"
				    tooltip-effect="dark"
				    style="width: 100%"
				    @selection-change="handleSelectionChange">
				    <el-table-column
				      type="selection"
				      width="55">
				    </el-table-column>
				    <el-table-column
				      label="日期"
				      width="120">
				      <template slot-scope="scope">{{ scope.row.date }}</template>
				    </el-table-column>
				    <el-table-column
				      prop="name"
				      label="姓名"
				      width="120">
				    </el-table-column>
				    <el-table-column
				      prop="address"
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
    	<el-pagination
			  background
			  layout="prev, pager, next"
			  :total="1000">
			</el-pagination>
    </div>
  </div>
</template>
<script>
export default {
    data() {
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
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  }
</script>
<style lang="scss">
	.newcom-wrap{
		width: 100%;
		color:#666;
		display: flex;
		flex-direction:column;
		.change-type{
			input{
				margin-right:14px;
			}
		}
		.newcom-main{
			background:rgba(255,255,255,1);
			box-shadow:0px 2px 7px 1px rgba(211,229,255,1);
			border-radius:12px;
			margin-top:16px;
			padding: 22px 32px;
			.open-search{
				background:rgba(244,244,244,1);
				border:1px solid rgba(230,230,230,1);
				border-radius:12px;
				text-align:center;
				color:#4083FF;
				text-decoration: underline;
				line-height: 64px;
				font-size: 14px;
			}
			.search-area{
				.if-all-cond{

				}
			}
			.search-result{
				display:flex;
				justify-content: space-between;
				margin:25px auto;
				span{
					b{
						color:#FF4040;
						font-weight: 100;
						padding: 0 5px;
					}
				}
				div{
					.el-select{
						margin-right: 10px;
					}
				}
			}
			.el-pagination{
				margin-top: 20px;
			}
		}
	}
</style>