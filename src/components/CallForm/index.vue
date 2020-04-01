<template>
	<div>
		<el-dialog class="add-clues highblue"
               title="新增线索"
               :visible.sync="curCluesVisible"
               :modal="true"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :showClose="false"
               :model="curCluesForm"          
               width="600px">
		<div class="call-duration" v-show="callPanelVisible">
      <h2 class="call-company highblue">{{curCluesForm.entName}}</h2>
      <p class="call-company-duration">{{countTime}}</p>        
    	<el-button type="danger"
               round @click="dropCall">挂断</el-button>
   </div>
   <div class="fetch-xphone" v-show="fetchXphoneVisible">
      <h2 class="call-company highblue">{{curCluesForm.entName}}</h2>
     <section v-show="editType == 'fetchxphone'">
        <p>您本次获取的虚拟号为：</p>
        <h4 class="highblue txtc">{{xphone}}</h4>
        <p>有效期为三分钟，过期后请重新获取</p>
        <p class="txtc highred">{{countDownTime}}</p>
      </section>
   </div>
      <el-form label-width="120px" :class="moreForm ?'heightAuto':'heightShort'">
        <el-form-item label="公司名称：" prop="entName">
          <el-input v-model="curCluesForm.entName"
                    placeholder="请输入公司名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="curCluesForm.name"
                    placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="contact">
          <el-input v-model="curCluesForm.contact" type="tel"
                    placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="部门：" prop="department">
          <el-input v-model="curCluesForm.department"
                    placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="职务：" prop="duties">
          <el-input v-model="curCluesForm.duties"
                    placeholder="请输入职务"></el-input>
        </el-form-item>
        <el-form-item label="微信号：" prop="wechat">
          <el-input v-model="curCluesForm.wechat"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="curCluesForm.email"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="地址：" prop="address">
          <el-input v-model="curCluesForm.address"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="跟进状态：" prop="fllowupStatus">
          <el-select v-model="curCluesForm.fllowupStatus">
            <el-option v-for="(item,index) in fllowupStatus" :value="index" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线索来源：" prop="dataSource">
          {{cluesSource[curCluesForm.dataSource]}}
        </el-form-item>
        <el-form-item label="下次跟进时间：" prop="nextFllowupTime">
          <el-date-picker
                      v-model="curCluesForm.nextFllowupTime"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%;"
                      value-format="timestamp"
                      :picker-options="expireTimeOption" :default-value="curCluesForm.nextFllowupTime" />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="curCluesForm.remark" prop="remark"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="end">
        <el-col :span="4" class="moreForm highblue"><span @click="toggleHeight">{{formTip}}</span></el-col>
      </el-row>
      <el-row type="flex"
              justify="end" class="add-clues-handle">
        <el-col :span="6">
          <el-button size="middle"
                     type="info"
                     round :disabled="callPanelVisible" @click="cancleEditForm">取消</el-button>   
        </el-col>
        <el-col :span="4">
          <el-button size="middle"
                     type="primary"
                     round  :disabled="callPanelVisible" @click="saveCluseForm">保存</el-button>
        </el-col>
      </el-row>        
      <el-row type="flex" justify="end" class="el-tips">
        <el-col :span="14"></el-col>
        <el-col :span="10">
          <el-alert
            title="通话结束前无法关闭表单"
            type="warning"
            show-icon :closable="false" v-show="callPanelVisible">
          </el-alert>
        </el-col>
      </el-row>  
    </el-dialog>
	</div>
</template>
<script>
import {updateClues} from '@/api/saleslead'
import {entIdBindCallDetail} from '@/api/orderdetail'
	export default {
		name: 'CallForm',
    props: {
      updateClue:{
        type: Function
      }
    },
		data(){
			return {
        sortType:['注册资本-升序','注册资本-降序','成立时间-升序','成立时间-降序'],
        cluesSource: ['新企推荐','企业查询', '转线索','回收站'],
        fllowupStatus:['待跟进','有意向','无意向','已成交','未成交'],
        moreForm: false,
        countTime:'正在呼叫中...',
        countDownTime: '',
        time:0,
        timer:null,
        expireTimeOption: {
          disabledDate(date) {
            return date.getTime() <= Date.now();
          }
        }
			}
		},
		computed:{ // 计算依赖
			callPanelVisible(){ //通话计时
				return this.$store.state.callform.callPanelVisible
			},
			curCluesVisible(){//线索表单
				return this.$store.state.callform.curCluesVisible
			},
			curCluesForm(){//当前线索form
				return this.$store.state.callform.curCluesForm
			},
      editType(){
        return this.$store.state.callform.editType
      },
      holdOn(){
        return this.$store.state.callcenter.hodeOn
      },
      formTip(){
        return this.moreForm ? '收起' : '展示更多信息'
      },
      xphone(){
        return this.$store.state.callform.xphone
      },
      fetchXphoneVisible(){
        return this.$store.state.callform.fetchXphoneVisible
      }
		},
    watch: {
      hodeOn: function (val){
        if(val){
          this.hodeOn = true
          this.timerStart() 
          this.curCluesForm.callStatus = 1       
        }else{
          this.hodeOn = false
          this.timerClear()
          this.countTime = ''
          this.curCluesForm.callStatus = 2 
        }
      }
    },
    created(){
      if(this.editType == 'fetchxphone'){
        this.countDown()
      }
    },
		methods: {
      sendCurClueToUserCenter(){
        entIdBindCallDetail({})
      },
      timerStart(){      
        this.timer = setInterval(()=>{
          ++this.time
          this.formateTime()
        },1000)
      },
      formateTime(){
        let h = parseInt(this.time / 3600)
        let m = parseInt((this.time - h * 3600) / 60)
        let s = this.time - h * 3600 - m * 60
        // 格式化
        h < 10 ? h = `0${h}` : ''
        m < 10 ? m = `0${m}` : ''
        s < 10 ? s = `0${s}` : ''
        this.countTime = `${h}:${m}:${s}`
        this.countDownTime = `${h}:${m}:${s}`
      },
      timerClear(){
        this.timer = null
        this.time = 0
      },
      countDown(){
        this.time = 3 * 60
        this.timer = setInterval(() => {
          if(this.time > 0){
            this.time--
            this.formateTime()
          }
        }, 1000)
      },
			dropCall(){
        this.$store.dispatch('callform/togglePanel')
        this.$store.dispatch('callcenter/drop_call')
        this.timerClear()
			},
      toggleHeight(){
        this.moreForm = !this.moreForm
      },
      cancleEditForm(){
        if(this.editType == 'call'){
          updateClues({id: this.curCluesForm.id, callStatus: this.curCluesForm.callStatus || 2,  lastCallTime:new Date().getTime()}).then(response => {
            if(response.status == 200){
              this.$store.dispatch('callform/toggleClueForm')
              this.updateClue()
              this.moreForm = false //收起表单
              this.$message.success('当前线索更新成功') 
            }else{
              this.$message.success('线索更新失败')
            }
          })
        }else if(this.editType == 'fetchxphone'){
          this.$store.commit('callform/TOGGLE_XPHONE')
          this.$store.dispatch('callform/toggleClueForm')
        }else{
          this.$store.dispatch('callform/toggleClueForm')
        }
      },
      saveCluseForm(){
        updateClues(this.curCluesForm).then(response => {
          if(response.status == 200){
            this.$store.dispatch('callform/toggleClueForm')
            this.updateClue()
            this.moreForm = false //收起表单
            this.$message.success('当前线索更新成功') 
          }else{
            this.$message.success('线索更新失败')
          }
        })
      }
		}
	}
</script>
<style lang="scss" scoped>
	  .el-dialog{
    border-radius: 10px;
    .el-dialog__body{
      z-index: 2006;
      overflow-y: scroll;
      overflow-x:hidden; 
    } 
    .el-form{
      .el-form-item{
        .el-form-item__label{
          font-weight:400;
        }
      }
    } 
    .heightAuto{ 
      height: auto;
    }
    .heightShort{     
      height: 19vh;
      overflow: hidden;
    }
    .moreForm{
      padding: 10px 0;
      cursor: pointer;
      text-align: right;
    }
    .el-tips{
      margin-top: 5px;
    }
    .call-duration,.fetch-xphone{
      width: 300px;
      min-height: 200px;
      padding:25px;
      box-shadow: 0 1px 3px rgba(0,0,0,.3);
      border-radius: 10px;
      border-radius: 2px;
      background: #fff;
      position: absolute;
      left:-320px;
      top:0;
      display: flex;
      flex-direction: column;
      align-items: center;
      .el-button{
        width: 200px;
        font-weight: 100;
        color: #fff;
      }
      .txtc{
        text-align:center;
      }
    }
  } 
</style>