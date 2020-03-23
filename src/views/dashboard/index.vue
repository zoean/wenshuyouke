<template>
  <div class="dashboard-container">
    <el-row>
      <!-- <el-button type="primary"
                 @click="loginServer">链入</el-button>
      <el-button type="info"
                 @click="DoDisConnect">断链</el-button> -->
      <el-button type="primary"
                 @click="checkIn()">签入</el-button>
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
                   @click="makeCall()">呼叫</el-button>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { mapMutations } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data () {
    return {
      calledTel: ''
    }
  },
  watch: {
    calledTel: function (val, oldVal) {
      this.$store.commit('callcenter/SET_USERTEL', val)
    }
  },
  methods: {
    checkIn () {
      this.$store.dispatch('callcenter/check_in')
    },
    checkOut () {
      this.$store.dispatch('callcenter/check_out')
    },
    makeCall () {
      this.$store.dispatch('callcenter/make_call')
    }
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
