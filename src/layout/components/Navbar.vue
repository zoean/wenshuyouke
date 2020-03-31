<template>
  <div class="navbar">
    <div class="navbar-left">
      <img width="134"
         height="29"
         class="logo"
         src="@/assets/images/logo.png" />
         <i class="el-icon-bell highblue"></i>
      <el-carousel direction="vertical" :autoplay="true">
        <el-carousel-item>
          <p>您的通话时长不足，请及时充值</p>
        </el-carousel-item>
        <el-carousel-item>
          <p>阿里巴巴入驻文投优客啦，快去领取商机吧</p>
        </el-carousel-item>
      </el-carousel>
    </div>    
    <div class="navbar-right">
      <div class="right-menu">
        <el-dropdown>          
          <p>
            <span class="svg-container">
              <svg-icon icon-class="user-message" />
            </span>
            <span>消息</span>
          </p>
          <el-dropdown-menu>
            <el-dropdown-item>2020-03-18 【帐户】坐席6001已开通帐号,请...</el-dropdown-item>
            <el-dropdown-item>2020-03-16 【充值】您已成功充值200000元...</el-dropdown-item>
            <el-dropdown-item>2020-03-12 【通话】您的通话时长已不足100...</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> 
        <el-dropdown @command="handleCommand">          
          <p>
            <span class="svg-container">
              <svg-icon icon-class="user-help" />
            </span>
            <span>帮助</span>
          </p>
          <el-dropdown-menu>
            <el-dropdown-item command="1">意见反馈</el-dropdown-item>
            <el-dropdown-item command="2">客服中心</el-dropdown-item>
            <el-dropdown-item command="3">帮助中心</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> 
        <el-dropdown>          
          <p>
            <span class="svg-container">
              <svg-icon icon-class="user-set" />
            </span>
            <span>设置</span>
          </p>
          <el-dropdown-menu @click.native="logout">
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> 
      </div>
      <!-- <div class="right-menu">
      <el-dropdown class="avatar-container"
                   trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'"
               class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown"
                          class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank"
             href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank"
             href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided
                            @click.native="logout">
            <span style="display:block;">
              <router-link to="/login">Log Out</router-link>
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
      <div class="user-info">
        <img width="30"
             height="30"
             src="@/assets/images/avater.png" />
        <span>{{name}}</span>
      </div>
    </div>

  <el-dialog :visible.sync="serviceCenterVisible" width="30%">
    <p>感谢您对文投优客的大力支持</p>
    <p>如有需要请拨打24小时服务热线：4001001111</p>
  </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'

export default {
  // components: {
  //   Breadcrumb,
  //   Hamburger
  // },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      this.$store.dispatch('user/logout')
      location.reload()
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleCommand(command) {//暂时写在navbar，后期调整
      if(command == 1){//意见反馈

      }else if(command == 2){//客服中心
        this.serviceCenterVisible = true
      }else{//帮助中心

      }
    }
  },
  data(){
    return {
      serviceCenterVisible:false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 64px;
  overflow: hidden;
  position: fixed;
  top:0;
  width:100%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  z-index: 1;
  .navbar-left{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex: 0 1 auto;
    width: 100%;
    .logo {
      margin: 18px 60px 0 30px;
    }
    i{
      margin-top:25px;
      font-size:20px;
    }
    .el-carousel{
      width: 50%;
      margin-left: 10px;
      p{
        margin: 0;
        line-height:64px;
      }
    }
  }
  
  .navbar-right {
    display: flex;
    justify-content: space-between;
    ul {
      width: 480px;
      list-style: none;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
    .user-info {
      width: 180px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      img {
        margin-right: 10px;
      }
    }
  }

  .right-menu {
    float: right;
    width: 300px;
    height: 64px;
    line-height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-right: 10px;
    &:focus {
      outline: none;
    }
    .el-dropdown{
      width: 33.3%;
      text-align: center;
      p{
        margin: 0;
        font-size: 16px;
      }
    }
    .el-dropdown.isactive{
      background: #4088FF;
      color: #fff;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
@keyframes moveUp {
  0% {
    top: 0px;
  }
  18% {
    top: 0px;
  }
  20% {
    top: -28px;
  }
  38% {
    top: -28px;
  }
  40% {
    top: -56px;
  }
  58% {
    top: -56px;
  }
  60% {
    top: -84px;
  }
  78% {
    top: -84px;
  }
  80% {
    top: -112px;
  }
  98% {
    top: -112px;
  }
}
  
@-webkit-keyframes moveUp{
  0% {
    top: 0px;
  }
  18% {
    top: 0px;
  }
  20% {
    top: -28px;
  }
  38% {
    top: -28px;
  }
  40% {
    top: -56px;
  }
  58% {
    top: -56px;
  }
  60% {
    top: -84px;
  }
  78% {
    top: -84px;
  }
  80% {
    top: -112px;
  }
  98% {
    top: -112px;
  }
}


</style>
