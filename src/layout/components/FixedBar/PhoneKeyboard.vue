<template>
  <div class="app-wrapper">
    <div class="keybord-pop">
      <el-row class="pop-title">
        <el-col :span="22">
          <i class="el-icon-phone"></i>
          拨打电话
        </el-col>
        <el-col :span="2">
          <i class="el-icon-close" @click="closePop()"></i>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName">
        <el-tab-pane label="拨号键盘" name="first">
          <el-row class="input-telno">
            <el-input
              placeholder="输入电话号码"
              v-model="telNumber"
              minlength="4"
              maxlength="12"
              show-word-limit
              autofocus="true"
              clearable
              type="tel"
              @change="verifyInput"
            ></el-input>
          </el-row>
          <ul class="number-keybord">
            <li v-for="(numGrop, index) in keyboardNum" :key="index">
              <p
                v-for="number in numGrop"
                :key="number"
                @click="addNumber(number)"
              >
                {{ number }}
              </p>
            </li>
          </ul>
          <el-row>
            <el-button
              class="call-handle"
              size="medium"
              type="primary"
              @click="callHandle"
              :disabled="callDisable"
              >呼叫</el-button
            >
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="呼叫历史" name="second">呼叫历史</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: "PhoneKeyboard",
  props: {
    toggleKeyboard: {
      //关闭父组件的拨号panel方法
      type: Function,
      default: null
    }
  },
  data() {
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
      wsUri: "ws://36.110.48.146:65006/",
      cc: 0,
      docheckin: 0, //签入状态 0 签出 1 签入
      str: '{"cmd":"0","seatno":"1001","telno":"","para":""}',
      websocket: null, //ws链接
      heartbeat_timer: 0, //心跳包定时器
      rev: "",
      seatId: 8001, //坐席号
      seatPassword: 1234,
      bindTel: 8001,
      calledTel: "13661190279"
    };
  },
  created() {
    this.loginServer();
  },
  methods: {
    closePop() {
      this.toggleKeyboard(); //调用父组件关闭panel方法
    },
    addNumber(item) {
      this.telNumber += item;
      console.log(this.telNumber);
    },
    callHandle() {
      this.checkIn(this.seatId, this.seatPassword, this.bindTel);
    },
    verifyInput() {
      // if (this.telNumber.length < 5) {
      //   this.callDisable = true;
      // } else if (this.telNumber.length > 12) {
      //   this.telNumber = this.telNumber(0, 12);
      //   this.callDisable = false;
      // } else {
      //   this.callDisable = false;
      // }
    },
    loginServer() {
      this.DisConnect(); //链入之前断链操作
      this.init();
    },
    init() {
      //心跳包
      console.log("开始链入");
      this.cc = 0;
      if (this.heartbeat_timer != 0) clearInterval(this.heartbeat_timer);
      this.heartbeat_timer = setInterval(() => {
        this.keepAlive(this.websocket);
      }, 5000); //每五秒监听一下ws状态
      this.initSocket();
    },
    initSocket() {
      //创建websocket链接
      console.log("creatSoket");
      if (this.websocket != null) this.DisConnect();
      console.log(this.wsUri);
      this.websocket = new WebSocket(this.wsUri);
      this.websocket.onopen = evt => {
        this.onOpen(evt);
      };
      this.websocket.onclose = evt => {
        this.onClose(evt);
      };
      this.websocket.onmessage = evt => {
        this.onMessage(evt);
      };
      this.websocket.onerror = evt => {
        this.onError(evt);
      };
    },
    onOpen(evt) {
      console.log("open");
    },
    onClose(evt) {
      console.log("onClose");
    },
    onMessage(evt) {
      console.log("onMessage");
      this.cc = 0;
      if (evt.data.length > 4) {
        this.rev = JSON.parse(evt.data);
        if (this.rev.state == 0 && this.rev.para == "BeCheckout")
          this.docheckin = 0;
      }
    },
    onError(evt) {
      console.log("onError");
    },
    DisConnect() {
      if (this.websocket != null) {
        this.websocket.close();
        this.websocket = null;
      }
    },
    DoDisConnect() {
      if (this.docheckin == 1) this.checkOut(this.seatId);
      this.DisConnect();
    },
    checkIn(seatId, password, telno) {
      this.str = `{"cmd":"1","seatno":"${seatId}","telno":"${telno}","para":"${password}"}`;
      console.log(this.str);
      this.websocket.send(this.str);
      this.docheckin = 1;
      this.makeCall(this.seatId, this.telNumber);
    },
    checkOut(seatno) {
      this.str = `{"cmd":"2","seatno":"${this.seatId}","telno":"","para":""}`;
      this.docheckin = 0;
      this.websocket.send(this.str);
      console.log(this.str);
    },
    makeCall(seatId, telno) {
      this.str = `{"cmd":"3","seatno":"${seatId}","telno":"${telno}","para":"1234567890-1234567890-1234567890-1234567890-ABCD"}`;
      console.log(this.str);
      this.websocket.send(this.str);
    },
    keepAlive(ws) {
      //每五秒钟轮询一次判断ws是否保持，断开重启
      this.cc++;
      if (this.websocket == WebSocket.CONNECTING) {
        console.log("链接正在建立");
        return;
      }
      if (this.websocket == WebSocket.CLOSING) {
        console.log("链接正在关闭");
        return;
      }
      if (this.websocket == WebSocket.CLOSED) {
        console.log("链接已关闭");
        this.initSocket();
        return;
      }
      if (this.docheckin && this.cc > 6) {
        this.cc = 3;
        this.initSocket();
        return;
      }
      // ws.send('{}')
    }
  },
  beforeDestroy() {
    this.DoDisConnect();
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
