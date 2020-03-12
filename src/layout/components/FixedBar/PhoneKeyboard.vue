<template>
  <div class="app-wrapper">
    <div class="keybord-pop">
      <el-row class="pop-title">
        <el-col :span="22">
          <i class="el-icon-phone"></i>
          拨打电话
        </el-col>
        <el-col :span="2">
          <i class="el-icon-close"
             @click="closePop()"></i>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName">
        <el-tab-pane label="拨号键盘"
                     name="first">
          <el-row class="input-telno">
            <el-input placeholder="输入电话号码"
                      v-model="telNumber"
                      minlength="4"
                      maxlength="12"
                      show-word-limit
                      autofocus="true"
                      clearable
                      type="tel"
                      @change="verifyInput"></el-input>
          </el-row>
          <ul class="number-keybord">
            <li v-for="(numGrop, index) in keyboardNum"
                :key="index">
              <p v-for="number in numGrop"
                 :key="number"
                 @click="addNumber(number)">
                {{ number }}
              </p>
            </li>
          </ul>
          <el-row>
            <el-button class="call-handle"
                       size="medium"
                       type="primary"
                       @click="callHandle"
                       :disabled="callDisable">呼叫</el-button>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="呼叫历史"
                     name="second">呼叫历史</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import store from '@/store'
export default {
  name: "PhoneKeyboard",
  props: {
    toggleKeyboard: {
      //关闭父组件的拨号panel方法
      type: Function,
      default: null
    }
  },
  data () {
    return {
      activeName: "first",
      telNumber: "",
      keyboardNum: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ["*", 0, "#"]
      ],
      callDisable: false,
    };
  },
  watch: {
    calledTel: function (val, oldVal) {
      this.$store.commit('callcenter/SET_USERTEL', val)
    }
  },
  created () {    
    this.$store.dispatch('callcenter/websocket_init')
  },
  methods: {
    closePop () {
      this.toggleKeyboard(); //调用父组件关闭panel方法
    },
    addNumber (item) {
      this.telNumber += item;
    },
    callHandle () {
      this.$store.dispatch('callcenter/make_call')
    },
    verifyInput () {
      // if (this.telNumber.length < 5) {
      //   this.callDisable = true;
      // } else if (this.telNumber.length > 12) {
      //   this.telNumber = this.telNumber(0, 12);
      //   this.callDisable = false;
      // } else {
      //   this.callDisable = false;
      // }
    },
    async makeCall () {
      await this.$store.dispatch('SET_USERTEL', this.telNumber)
      this.$store.dispatch('callcenter/make_call')
    }
  },
  beforeDestroy () {
    this.$store.dispatch('callcenter/websocket_out')
  }
};
</script>
<style scoped>
.keybord-pop {
  border: 1px solid #ebebeb;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  position: fixed;
  bottom: 10px;
  right: 110px;
  width: 260px;
  height: 375px;
  background: #f2f2f2;
}
.el-tabs {
  background: #fff;
  padding: 2px 0 10px 0;
}
.el-tabs__header {
  padding: 0 10px;
}
.input-telno {
  background: #fff;
}
.pop-title {
  padding: 10px;
}
.el-icon-close {
  cursor: pointer;
}
.input-telno,
.el-tabs__nav {
  padding: 0 20px;
}
.number-keybord {
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style: none;
  width: 100%;
  flex-grow: 1;
  padding: 0;
  border-bottom: 1px solid #eee;
}
.number-keybord li {
  display: flex;
  justify-content: center;
  flex-grow: 1;
}
.number-keybord li p:nth-child(1) {
  border-left: 0;
}
.number-keybord li p {
  border: 1px solid #eee;
  border-right: 0;
  border-bottom: 0;
  flex: 1;
  text-align: center;
  margin: 0;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
}
.number-keybord li p:hover {
  background: #eee;
}
.number-keybord li p:active {
  background: #ebebeb;
}
.call-handle {
  margin-left: 10%;
  width: 80%;
}
/* .number-keybord{} */
</style>
