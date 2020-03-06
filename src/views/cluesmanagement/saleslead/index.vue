<template>
	<div class="main-box">
		<div class="search-area">
			<dl>
				<dt>商机来源：</dt>
				<dd>
					<el-button>转线索</el-button>
					<el-button>已触达</el-button>
					<el-button>待触达</el-button>
				</dd>
			</dl>
			<dl>
				<dt>更新时间：</dt>
				<dd>
					<el-date-picker
			      v-model="value2"
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
				<dt>查询条件：</dt>
				<dd>
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
				</dd>
				<dd>
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
				</dd>
			</dl>
			<dl>
				<dt>内容搜索：</dt>
				<dd>
					<el-input placeholder="请输入内容" v-model="input3">				    
				    <el-button slot="append" icon="el-icon-search"></el-button>
				  </el-input>
				</dd>
			</dl>
			<div class="companyHandle">	
				<p>本次更新<span class="highred">788</span>条，更新时间为12-02</p>
				<el-popover
				  placement="top"
				  width="160"
				  v-model="visible">
				  <p>这是一段内容这是一段内容确定删除吗？</p>
				  <div style="text-align: right; margin: 0">
				    <el-button size="mini" type="text" @click="visible = false">取消</el-button>
				    <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
				  </div>
				  <el-button slot="reference">转移至线索池</el-button>
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
		      label="号码"
		      width="120">
		      <template slot-scope="scope"><el-button>一键呼叫</el-button></template>
		    </el-table-column>
		    <el-table-column
		      prop="name"
		      label="名片">
		      <template>
						<el-row>
							<el-col :span="6"><h2>文投大数据</h2></el-col>
							<el-col :span="18">李鲜花|1992-01-01|100000万元</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-tag
							    v-for="item in items"
							    :key="item.label"
							    :type="item.type"
							    effect="light">
							    {{ item.label }}
							    北京市石景山区石门路2号院
							  </el-tag>
							</el-col>
							<el-col>
								<el-tag
							    v-for="item in items"
							    :key="item.label"
							    :type="item.type"
							    effect="dark">
							    {{ item.label }}
							  </el-tag>
							</el-col>
							<el-col>
								<el-tag
							    v-for="item in items"
							    :key="item.label"
							    :type="item.type"
							    effect="dark">
							    {{ item.label }}
							  </el-tag>
							</el-col>
						</el-row>
		      </template>
		    </el-table-column>
		  </el-table>
		  <el-pagination
	      @size-change="handleSizeChange"
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
	export default{
		name:'CompanyList',
		data(){
			return{
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
        items:[]
      }
		}
	}
</script>
<style lang="scss">
.search-area{
	display: flex;
	flex-direction: column;
	dl{
		display: flex;
		flex-direction: row;
		align-items: center;
		dd{
			margin-left: 10px;
		}
	}
	.companyHandle{
		display: flex;
		justify-content: space-between;
	}
}
.saleslead-data{
	.el-row{
		.el-col{
			h2{
				font-size: 24px;
			}
		}
	}
}
.el-pagination{
	margin-top: 20px;
}
</style>