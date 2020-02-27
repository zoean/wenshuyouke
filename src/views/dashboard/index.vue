<template>
  <div class="dashboard-container">
    <el-row>
      <!-- <el-button type="primary"
                 @click="loginServer">链入</el-button>
      <el-button type="info"
                 @click="DoDisConnect">断链</el-button> -->
      <el-button type="primary"
                 @click="checkIn(seatId,seatPassword,bindTel)">签入</el-button>
      <el-button type="info"
                 @click="checkOut(seatId)">签出</el-button>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input v-model="calledTel"></el-input>
      </el-col>
      <el-col :span="8">
        <el-button :span="8"
                   type="primary"
                   @click="makeCall(seatId,calledTel)">呼叫</el-button>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created () {
    this.loginServer()
  },
  data () {
    return {
      wsUri: 'ws://36.110.48.146:65006/',
      cc: 0,
      docheckin: 0, //签入状态 0 签出 1 签入
      str: '{"cmd":"0","seatno":"1001","telno":"","para":""}',
      websocket: null, //ws链接
      heartbeat_timer: 0, //心跳包定时器
      rev: '',
      seatId: 8001, //坐席号
      seatPassword: 1234,
      bindTel: 8001,
      calledTel: '13661190279'
    }
  },
  methods: {
    loginServer () {
      this.DisConnect();//链入之前断链操作
      this.init();
    },
    init () { //心跳包
      console.log('开始链入')
      this.cc = 0;
      if (this.heartbeat_timer != 0) clearInterval(this.heartbeat_timer)
      this.heartbeat_timer = setInterval(() => {
        this.keepAlive(this.websocket)
      }, 5000) //每五秒监听一下ws状态
      this.initSocket()
    },
    initSocket () {//创建websocket链接
      console.log('creatSoket')
      if (this.websocket != null) this.DisConnect()
      console.log(this.wsUri)
      this.websocket = new WebSocket(this.wsUri)
      this.websocket.onopen = (evt) => { this.onOpen(evt) }
      this.websocket.onclose = (evt) => { this.onClose(evt) }
      this.websocket.onmessage = (evt) => { this.onMessage(evt) }
      this.websocket.onerror = (evt) => { this.onError(evt) }
    },
    onOpen (evt) {
      console.log('open')
    },
    onClose (evt) {
      console.log('onClose')
    },
    onMessage (evt) {
      console.log('onMessage')
      this.cc = 0
      if (evt.data.length > 4) {
        this.rev = JSON.parse(evt.data)
        if (this.rev.state == 0 && this.rev.para == 'BeCheckout')
          this.docheckin = 0
      }
    },
    onError (evt) {
      console.log('onError')
    },
    DisConnect () {
      if (this.websocket != null) {
        this.websocket.close()
        this.websocket = null
      }
    },
    DoDisConnect () {
      if (this.docheckin == 1) this.checkOut(this.seatId)
      this.DisConnect()
    },
    checkIn (seatId, password, telno) {
      this.str = `{"cmd":"1","seatno":"${seatId}","telno":"${telno}","para":"${password}"}`
      console.log(this.str)
      this.websocket.send(this.str)
      this.docheckin = 1
    },
    checkOut (seatno) {
      this.str = `{"cmd":"2","seatno":"${this.seatId}","telno":"","para":""}`
      this.docheckin = 0
      this.websocket.send(this.str)
      console.log(this.str)
    },
    makeCall (seatId, telno) {
      this.str = `{"cmd":"3","seatno":"${seatId}","telno":"${telno}","para":"1234567890-1234567890-1234567890-1234567890-ABCD"}`
      console.log(this.str)
      this.websocket.send(this.str)
    },
    keepAlive (ws) { //每五秒钟轮询一次判断ws是否保持，断开重启
      this.cc++
      if (this.websocket == WebSocket.CONNECTING) {
        console.log('链接正在建立')
        return
      }
      if (this.websocket == WebSocket.CLOSING) {
        console.log('链接正在关闭')
        return
      }
      if (this.websocket == WebSocket.CLOSED) {
        console.log('链接已关闭')
        this.initSocket()
        return
      }
      if (this.docheckin && this.cc > 6) {
        this.cc = 3
        this.initSocket()
        return
      }
      // ws.send('{}')

    }
  },
  beforeDestroy () {
    this.DoDisConnect()
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.el-row {
  margin-bottom: 20px;
}
</style>
