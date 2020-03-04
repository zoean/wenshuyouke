<template>
  <div class="app-wrapper">
    <el-button-group>
      <el-button icon="el-icon-phone"
                 @click="toggleKeyboard">电话</el-button>
      <el-button icon="el-icon-s-promotion">短信</el-button>
    </el-button-group>
    <PhoneKeyboard v-show="showKeyboard"
                   :toggleKeyboard="toggleKeyboard" />
  </div>
</template>
<script>
import PhoneKeyboard from "./PhoneKeyboard";
export default {
  name: "FixedBar",
  components: {
    PhoneKeyboard
  },
  data () {
    return {
      showKeyboard: false
    };
  },
  methods: {
    toggleKeyboard () {
      this.showKeyboard = !this.showKeyboard;
    }
  }
};
</script>
<style scoped>
.el-button-group {
  width: 100px;
  height: 200px;
  position: fixed;
  bottom: -90px;
  right: 10px;
  z-index: 10;
}
.el-button {
  border-radius: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}
.el-button span {
  padding-top: 5px;
}
</style>
