<template>
  <div>
  <div class="common-bar">
      <hamburger :is-active="sidebar.opened"
               class="hamburger-container highblue"
               @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container highblue" />
    </div>
  <section class="app-main">    
    <transition name="fade-transform"
                mode="out-in">
      <router-view :key="key" />
    </transition>    
  </section>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
export default {
  name: 'AppMain',
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ]),
    key () {
      return this.$route.path
    }
  },
  methods:{
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  /* width: calc(100vh - 210px); */
  position: relative;
  overflow: hidden;
  margin-left: 0rem;
  /* margin-left: 210px; */
  padding: 15px;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
.common-bar{
  display: flex;
  justify-content: flex-start;
  color:rgb(102, 102, 102);
  background: #fff;
  line-height:50px;
  .hamburger-container{
    cursor:pointer;
  }
  .breadcrumb-container{
    .el-breadcrumb__item{
      line-height:50px;
    }
  }
}
</style>
